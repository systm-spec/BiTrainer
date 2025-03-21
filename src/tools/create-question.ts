// tools/create-question.ts
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);

if (args.length < 3) {
    console.log(
        'Usage: ts-node tools/create-question.ts "Fragetext" <numChoices> <numImages>'
    );
    process.exit(1);
}

const [text, numChoicesStr, numImagesStr] = args;
const numChoices = parseInt(numChoicesStr);
const numImages = parseInt(numImagesStr);

const questionsDir = path.join(__dirname, "../public/questions");
if (!fs.existsSync(questionsDir))
    fs.mkdirSync(questionsDir, { recursive: true });

const getNextQuestionId = () => {
    const folders = fs
        .readdirSync(questionsDir)
        .filter((name) => /^q\d{3}$/.test(name));
    const lastId =
        folders
            .map((name) => parseInt(name.slice(1)))
            .sort((a, b) => b - a)[0] || 0;
    const nextId = `q${(lastId + 1).toString().padStart(3, "0")}`;
    return nextId;
};

const questionId = getNextQuestionId();
const questionPath = path.join(questionsDir, questionId);
fs.mkdirSync(questionPath);

const imageFiles: string[] = [];
for (let i = 1; i <= numImages; i++) {
    const imgName = `image${i}.png`;
    const imgPath = path.join(questionPath, imgName);
    fs.writeFileSync(imgPath, "");
    imageFiles.push(imgName);
}

const choices = Array.from(
    { length: numChoices },
    (_, i) => `Antwort ${i + 1}`
);

const questionJSON = {
    id: questionId,
    text,
    images: imageFiles,
    choices,
    correct: 0,
};

console.log("\nFrage-Ordner erstellt: ", questionId);
console.log("\n📋 JSON zum Einfügen in questions.json:");
console.log(JSON.stringify(questionJSON, null, 2));
