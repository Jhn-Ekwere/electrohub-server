const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


subCategorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

subCategorySchema.set("toJSON", {
  virtuals: true,
});


const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
