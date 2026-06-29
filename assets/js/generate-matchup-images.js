const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const WIDTH = 1200;
const HEIGHT = 630;

const ROOT_DIR = path.join(__dirname, "..");

const LOGO_DIR = path.join(ROOT_DIR, "images", "teams");
const OUT_DIR = path.join(ROOT_DIR, "images", "matchups");

console.log("Looking for logos in:", LOGO_DIR);
console.log("Saving matchup images to:", OUT_DIR);

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

const graphics = [
    {
        file: "air-yards.png",
        title: "Air Yards Comparison",
        leftTeam: "sf",
        rightTeam: "car",
        leftValue: "120",
        rightValue: "35",
        metric: "Air Yards",
        leftLabel: "High Downfield Usage",
        rightLabel: "Limited Downfield Usage"
    },
    {
        file: "yards-per-route-run.png",
        title: "Yards Per Route Run",
        leftTeam: "dal",
        rightTeam: "phi",
        leftValue: "2.8",
        rightValue: "1.4",
        metric: "YPRR",
        leftLabel: "Efficient Route Production",
        rightLabel: "Lower Route Efficiency"
    },
    {
        file: "snap-share.png",
        title: "Snap Share Comparison",
        leftTeam: "buf",
        rightTeam: "kc",
        leftValue: "85%",
        rightValue: "45%",
        metric: "Snap Share",
        leftLabel: "Full-Time Usage",
        rightLabel: "Rotational Usage"
    },
    {
        file: "target-share.png",
        title: "Target Share Comparison",
        leftTeam: "dal",
        rightTeam: "phi",
        leftValue: "28%",
        rightValue: "14%",
        metric: "Target Share",
        leftLabel: "Primary Read",
        rightLabel: "Secondary Option"
    },
    {
        file: "red-zone-usage.png",
        title: "Red Zone Usage",
        leftTeam: "cle",
        rightTeam: "cin",
        leftValue: "35%",
        rightValue: "10%",
        metric: "Red Zone Share",
        leftLabel: "Touchdown Upside",
        rightLabel: "Limited Scoring Role"
    },
    {
        file: "epa.png",
        title: "EPA Comparison",
        leftTeam: "sf",
        rightTeam: "car",
        leftValue: "+0.21",
        rightValue: "-0.08",
        metric: "EPA / Play",
        leftLabel: "Efficient Offense",
        rightLabel: "Low Efficiency"
    },
    {
        file: "success-rate.png",
        title: "Success Rate",
        leftTeam: "buf",
        rightTeam: "kc",
        leftValue: "65%",
        rightValue: "45%",
        metric: "Success Rate",
        leftLabel: "Consistent Production",
        rightLabel: "Volatile Output"
    }
];

function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
    ctx.stroke();
}

async function generateGraphic(item) {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    gradient.addColorStop(0, "#07111f");
    gradient.addColorStop(0.5, "#0b1b2e");
    gradient.addColorStop(1, "#06101c");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    for (let x = 0; x < WIDTH; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
    }
    for (let y = 0; y < HEIGHT; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 52px Arial";
    ctx.textAlign = "center";
    ctx.fillText(item.title, WIDTH / 2, 90);

    ctx.fillStyle = "#66d9ff";
    ctx.font = "bold 24px Arial";
    ctx.fillText("PLAYMAKER PRIME MATCHUP INTELLIGENCE", WIDTH / 2, 130);

    const leftLogo = await loadImage(path.join(LOGO_DIR, `${item.leftTeam}.png`));
    const rightLogo = await loadImage(path.join(LOGO_DIR, `${item.rightTeam}.png`));

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.strokeStyle = "rgba(102,217,255,0.25)";
    drawRoundedRect(ctx, 110, 180, 410, 310, 28);
    drawRoundedRect(ctx, 680, 180, 410, 310, 28);

    ctx.drawImage(leftLogo, 255, 205, 120, 120);
    ctx.drawImage(rightLogo, 825, 205, 120, 120);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 78px Arial";
    ctx.fillText(item.leftValue, 315, 395);
    ctx.fillText(item.rightValue, 885, 395);

    ctx.fillStyle = "#9bb4c8";
    ctx.font = "bold 24px Arial";
    ctx.fillText(item.metric, 315, 430);
    ctx.fillText(item.metric, 885, 430);

    ctx.fillStyle = "#66d9ff";
    ctx.font = "22px Arial";
    ctx.fillText(item.leftLabel, 315, 465);
    ctx.fillText(item.rightLabel, 885, 465);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Arial";
    ctx.fillText("VS", WIDTH / 2, 360);

    ctx.fillStyle = "rgba(102,217,255,0.14)";
    ctx.beginPath();
    ctx.arc(WIDTH / 2, 345, 62, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#9bb4c8";
    ctx.font = "20px Arial";
    ctx.fillText("Built for NFL prop research, matchup trends, and player usage analysis.", WIDTH / 2, 560);

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(path.join(OUT_DIR, item.file), buffer);

    console.log(`Created ${item.file}`);
}

async function run() {
    for (const graphic of graphics) {
        await generateGraphic(graphic);
    }
}

run();