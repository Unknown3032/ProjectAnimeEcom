import mongoose from "mongoose";

const animeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    japanесе: String,
    englishName: String,
    description: {
      type: String,
      maxlength: 2000,
    },
    image: {
      type: String,
      required: true,
    },
    banner: String,
    genre: [
      {
        type: String,
        enum: [
          "Action",
          "Adventure",
          "Comedy",
          "Drama",
          "Fantasy",
          "Horror",
          "Mecha",
          "Mystery",
          "Romance",
          "Sci-Fi",
          "Slice of Life",
          "Sports",
          "Supernatural",
          "Thriller",
        ],
      },
    ],
    studio: String,
    releaseYear: Number,
    status: {
      type: String,
      enum: ["Ongoing", "Completed", "Upcoming"],
      default: "Ongoing",
    },
    episodes: Number,
    rating: {
      type: Number,
      min: 0,
      max: 10,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    productCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

animeSchema.index({ name: "text", description: "text" });
animeSchema.index({ slug: 1 });
animeSchema.index({ popularity: -1 });

const Anime = mongoose.models.Anime || mongoose.model("Anime", animeSchema);

export default Anime;
