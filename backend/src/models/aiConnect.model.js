import mongoose from "mongoose";

const aiContentSchema = new mongoose.Schema(
    {
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
            required: true
        },
        transcript: {
            type: String,
            default: ""
        },
        summary: {
            type: String,
            default: ""
        },
        importantTopics: [
            {
                type: String
            }
        ],
        importantQuestions: [
            {
                type: String
            }
        ],
        studyNotes: {
            type: String,
            default: ""
        },
        quiz: [
            {
                question: {
                    type: String,
                    required: true
                },
                options: [
                    {
                        type: String,
                        required: true
                    }
                ],
                correctAnswer: {
                    type: String,
                    required: true
                },
                explanation: {
                    type: String,
                    default: ""
                }
            }
        ],
        status: {
            type: String,
            enum: ["pending", "processing", "completed", "failed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

export const AiContent = mongoose.model("AiContent", aiContentSchema);
