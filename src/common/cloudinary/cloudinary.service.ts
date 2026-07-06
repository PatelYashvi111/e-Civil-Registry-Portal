import { Inject, Injectable } from "@nestjs/common";
import { v2 as cloudinaryType } from "cloudinary";

interface CloudinaryUploadResult {
  url: string;
  public_id: string;
}

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject("CLOUDINARY")
    private readonly cloudinary: typeof cloudinaryType,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryUploadResult> {

    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);

          resolve({
            url: result?.secure_url as string,
            public_id: result?.public_id as string,
          });
        },
      );

      stream.end(file.buffer);
    });
  }

  async deleteFile(publicId: string) {
    return this.cloudinary.uploader.destroy(publicId);
  }
}