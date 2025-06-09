import React, { useEffect, useRef, useState } from 'react';

interface CaptchaProps {
    identifyCode?: string;
    fontSizeMin?: number;
    fontSizeMax?: number;
    backgroundColor?: string;
    backgroundColorMin?: number;
    backgroundColorMax?: number;
    colorMin?: number;
    colorMax?: number;
    lineFlag?: boolean;
    lineColorMin?: number;
    lineColorMax?: number;
    dotFlag?: boolean;
    dotColorMin?: number;
    dotColorMax?: number;
    contentWidth?: number;
    contentHeight?: number;
    textColor?: string;
    onClick?: (code: string) => void;
}

const LoginCode: React.FC<CaptchaProps> = ({
                                               identifyCode = '123456789',
                                               fontSizeMin = 16,
                                               fontSizeMax = 20,
                                               backgroundColor = '',
                                               backgroundColorMin = 180,
                                               backgroundColorMax = 240,
                                               colorMin = 50,
                                               colorMax = 160,
                                               lineFlag = false,
                                               lineColorMin = 40,
                                               lineColorMax = 180,
                                               dotFlag = true,
                                               dotColorMin = 100,
                                               dotColorMax = 255,
                                               contentWidth = 70,
                                               contentHeight = 30,
                                               textColor = '',
                                               onClick,
                                           }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [code, setCode] = useState('');

    const randomNum = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min) + min);
    };

    const randomColor = (min: number, max: number) => {
        const r = randomNum(min, max);
        const g = randomNum(min, max);
        const b = randomNum(min, max);
        return `rgb(${r},${g},${b})`;
    };

    const getRandomStr = (number: number) => {
        const x = identifyCode;
        let str = '';
        for (let i = 0; i < number; i++) {
            str += x[parseInt(String(Math.random() * x.length))];
        }
        return str;
    };

    const drawPic = () => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, contentWidth, contentHeight);
        ctx.textBaseline = 'bottom';

        ctx.fillStyle = backgroundColor || randomColor(backgroundColorMin, backgroundColorMax);
        ctx.fillRect(0, 0, contentWidth, contentHeight);

        const result = getRandomStr(4);
        setCode(result);

        for (let i = 0; i < result.length; i++) {
            drawText(ctx, result[i], i, result.length);
        }

        if (lineFlag) drawLine(ctx);
        if (dotFlag) drawDot(ctx);
    };

    const drawText = (ctx: CanvasRenderingContext2D, txt: string, i: number, length: number) => {
        ctx.fillStyle = textColor || randomColor(colorMin, colorMax);
        ctx.font = `${randomNum(fontSizeMin, fontSizeMax)}px SimHei`;
        const x = (i + 1) * (contentWidth / (length + 1));
        const y = randomNum(fontSizeMax, contentHeight);
        const deg = randomNum(-10, 10);

        ctx.translate(x, y);
        ctx.rotate((deg * Math.PI) / 180);
        ctx.fillText(txt, 0, 0);

        ctx.rotate((-deg * Math.PI) / 180);
        ctx.translate(-x, -y);
    };

    const drawLine = (ctx: CanvasRenderingContext2D) => {
        for (let i = 0; i < 8; i++) {
            ctx.strokeStyle = randomColor(lineColorMin, lineColorMax);
            ctx.beginPath();
            ctx.moveTo(randomNum(0, contentWidth), randomNum(0, contentHeight));
            ctx.lineTo(randomNum(0, contentWidth), randomNum(0, contentHeight));
            ctx.stroke();
        }
    };

    const drawDot = (ctx: CanvasRenderingContext2D) => {
        for (let i = 0; i < 10; i++) {
            ctx.fillStyle = randomColor(0, 255);
            ctx.beginPath();
            ctx.arc(randomNum(0, contentWidth), randomNum(0, contentHeight), 1, 0, 2 * Math.PI);
            ctx.fill();
        }
    };

    const handleClick = () => {
        drawPic();
    };

    // Draw the picture and set the code on initial render
    useEffect(() => {
        drawPic();
    }, []);

    // Notify the parent when the code is updated
    useEffect(() => {
        if (onClick && code) {
            onClick(code.toLowerCase());
        }
    }, [code, onClick]);

    return (
        <canvas
            style={{ cursor: 'pointer', borderRadius: '5px' }}
            ref={canvasRef}
            width={contentWidth}
            height={contentHeight}
            onClick={handleClick}
        ></canvas>
    );
};

export default LoginCode;
