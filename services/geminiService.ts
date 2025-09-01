
import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerationResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateApp(prompt: string): Promise<string> {
  const systemInstruction = `You are an expert web developer specializing in creating single-file, production-ready HTML applications.
Your task is to generate a complete index.html file based on the user's prompt.
The generated file must be fully self-contained.
All CSS must be inside a <style> tag in the <head>.
All JavaScript must be inside a <script> tag at the end of the <body>.
The application should be visually appealing, responsive, and use modern design principles.
Do not include any explanations, comments, or markdown formatting like \`\`\`html.
Output only the raw HTML code starting with <!DOCTYPE html>.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
        },
    });
    return response.text;
  } catch (error) {
    console.error('Error calling Gemini API for app generation:', error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate app: ${error.message}`);
    }
    throw new Error('An unknown error occurred while communicating with the API for app generation.');
  }
}

export async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
      },
    });

    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!imageBytes) {
      throw new Error("The AI model did not return an image. This could be due to safety filters or an issue with the prompt. Please try again with a different description.");
    }

    return imageBytes; // This is a base64 string

  } catch (error) {
    console.error('Error calling Gemini API for image generation:', error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error('An unknown error occurred while communicating with the API for image generation.');
  }
}

export async function editImage(
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<GenerationResult> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let generatedImage: string | null = null;
    let generatedText: string = '';

    const candidate = response.candidates?.[0];

    // Safely access parts to prevent a crash if the response has no content (e.g., due to safety blocks).
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          generatedImage = part.inlineData.data;
        } else if (part.text) {
          generatedText += part.text;
        }
      }
    }

    if (!generatedImage) {
      // Create a more user-friendly error message based on the API response.
      let userFriendlyMessage = "The AI model did not return an image. Please try again or adjust your prompt.";

      const blockReason = response.promptFeedback?.blockReason;
      if (blockReason) {
        userFriendlyMessage = `Your request was blocked for safety reasons (${blockReason}). Please modify your prompt or image.`;
      } else {
        const finishReason = candidate?.finishReason;
        // Handle specific finish reasons like SAFETY or PROHIBITED_CONTENT
        if (finishReason && (finishReason.toUpperCase() === 'SAFETY' || finishReason.toUpperCase() === 'PROHIBITED_CONTENT')) {
          userFriendlyMessage = "Your request was blocked by the safety filter. Please use a different image or modify your prompt.";
        } else if (finishReason && finishReason !== 'STOP') {
          userFriendlyMessage = `Image generation stopped unexpectedly. Reason: ${finishReason}.`;
        }
      }
      throw new Error(userFriendlyMessage);
    }

    return { image: generatedImage, text: generatedText.trim() };

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error('An unknown error occurred while communicating with the API.');
  }
}
