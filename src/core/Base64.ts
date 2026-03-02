
export class Base64 {
  private static readonly lookup: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  private static readonly revLookup: number[] = [];

  static {
    for (let i = 0, len = Base64.lookup.length; i < len; ++i) {
      Base64.revLookup[Base64.lookup.charCodeAt(i)] = i;
    }
    Base64.revLookup['-'.charCodeAt(0)] = 62;
    Base64.revLookup['_'.charCodeAt(0)] = 63;
  }

  public static encode(data: Uint8Array): string {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(data).toString("base64");
    }

    let len = data.length;
    let extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
    let output = "";
    let temp, length;

    let i;
    for (i = 0, length = len - extraBytes; i < length; i += 3) {
      temp = (data[i]! << 16) + (data[i + 1]! << 8) + (data[i + 2]!);
      output += Base64.tripletToBase64(temp);
    }

    if (extraBytes === 1) {
      temp = data[len - 1]!;
      output += Base64.lookup[temp >> 2];
      output += Base64.lookup[(temp << 4) & 0x3F];
      output += "==";
    } else if (extraBytes === 2) {
      temp = (data[len - 2]! << 8) + (data[len - 1]!);
      output += Base64.lookup[temp >> 10];
      output += Base64.lookup[(temp >> 4) & 0x3F];
      output += Base64.lookup[(temp << 2) & 0x3F];
      output += "=";
    }

    return output;
  }

  public static decode(base64: string): Uint8Array {
    if (typeof Buffer !== "undefined") {
      return new Uint8Array(Buffer.from(base64, "base64"));
    }

    let len = base64.length;
    if (len % 4 > 0) {
      throw new Error("Invalid string. Length must be a multiple of 4");
    }

    let placeHolders = base64.charAt(len - 2) === "=" ? 2 : base64.charAt(len - 1) === "=" ? 1 : 0;
    let byteLength = (len * 3) / 4 - placeHolders;
    let bytes = new Uint8Array(byteLength);

    let L = len - (placeHolders > 0 ? 4 : 0);
    let i, j, temp;

    for (i = 0, j = 0; i < L; i += 4) {
      temp = (Base64.revLookup[base64.charCodeAt(i)]! << 18) | 
             (Base64.revLookup[base64.charCodeAt(i + 1)]! << 12) | 
             (Base64.revLookup[base64.charCodeAt(i + 2)]! << 6) | 
             Base64.revLookup[base64.charCodeAt(i + 3)]!;
      bytes[j++] = (temp >> 16) & 0xFF;
      bytes[j++] = (temp >> 8) & 0xFF;
      bytes[j++] = temp & 0xFF;
    }

    if (placeHolders === 2) {
      temp = (Base64.revLookup[base64.charCodeAt(i)]! << 2) | 
             (Base64.revLookup[base64.charCodeAt(i + 1)]! >> 4);
      bytes[j++] = temp & 0xFF;
    } else if (placeHolders === 1) {
      temp = (Base64.revLookup[base64.charCodeAt(i)]! << 10) | 
             (Base64.revLookup[base64.charCodeAt(i + 1)]! << 4) | 
             (Base64.revLookup[base64.charCodeAt(i + 2)]! >> 2);
      bytes[j++] = (temp >> 8) & 0xFF;
      bytes[j++] = temp & 0xFF;
    }

    return bytes;
  }

  private static tripletToBase64(num: number): string {
    return Base64.lookup[(num >> 18) & 0x3F]! +
           Base64.lookup[(num >> 12) & 0x3F]! +
           Base64.lookup[(num >> 6) & 0x3F]! +
           Base64.lookup[num & 0x3F]!;
  }
}
