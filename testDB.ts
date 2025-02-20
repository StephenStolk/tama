import connectToDatabase from "@/lib/mongoose";
import Image from "@/models/image.model"

(async () => {
  try {
    await connectToDatabase();
    const images = await Image.find();
    console.log(images);
  } catch (error) {
    console.error("DB Fetch Error:", error);
  }
})();
