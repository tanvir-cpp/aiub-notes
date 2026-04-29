import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "./supabase";
import type { FileAsset } from "../types";

export const MATERIAL_BUCKET = "materials";

const imageTypes = ["jpg", "jpeg", "png", "gif", "webp"];
const previewableDocTypes = ["pdf", "ppt", "pptx", "doc", "docx"];

export function extensionFromName(name: string) {
  const match = /\.([a-z0-9]+)$/i.exec(name);
  return match?.[1]?.toLowerCase() ?? "bin";
}

export function isSupportedFile(name: string) {
  return [...imageTypes, ...previewableDocTypes].includes(extensionFromName(name));
}

export function isImageFile(fileType: string) {
  return imageTypes.includes(fileType.toLowerCase());
}

export async function fileToArrayBuffer(asset: FileAsset) {
  const response = await fetch(asset.uri);
  return response.arrayBuffer();
}

export async function createSignedMaterialUrl(path: string, expiresIn = 60 * 30) {
  const { data, error } = await supabase.storage.from(MATERIAL_BUCKET).createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

export function previewUrlForFile(signedUrl: string, fileType: string) {
  const normalized = fileType.toLowerCase();
  if (isImageFile(normalized)) {
    return signedUrl;
  }
  
  if (normalized === "pdf" && Platform.OS !== "android") {
    return signedUrl;
  }

  return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(signedUrl)}`;
}

export async function shareOrDownloadFile(signedUrl: string, fileName: string) {
  if (Platform.OS === "web") {
    await WebBrowser.openBrowserAsync(signedUrl);
    return;
  }

  const target = `${FileSystem.cacheDirectory}${fileName}`;
  const download = await FileSystem.downloadAsync(signedUrl, target);
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(download.uri);
  } else {
    await WebBrowser.openBrowserAsync(signedUrl);
  }
}

export function cleanFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
}
