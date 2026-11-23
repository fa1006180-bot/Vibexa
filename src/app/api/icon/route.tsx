import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const sizeParam = Number(req.nextUrl.searchParams.get("size")) || 512;
  const size = sizeParam === 192 ? 192 : 512;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
          borderRadius: "22%",
          color: "white",
          fontSize: size * 0.55,
          fontWeight: 800,
        }}
      >
        V
      </div>
    ),
    { width: size, height: size }
  );
}