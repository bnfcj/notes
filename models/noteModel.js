const mongoose = require("mongoose");
const noteSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    important: { type: Boolean, default: false },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI).then(() => {});
module.exports = mongoose.model("Note", noteSchema);
