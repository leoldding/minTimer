import React, { useState, useEffect, useRef } from "react";
import { generateScramble } from "../../scramble/scramble";

type SolveInfo = {
    time: string;
    scramble: string;
}

const Timer: React.FC = () => {
    const [time, setTime] = useState<number>(0);
    const minutes = String(Math.floor((time / 60000) % 60)).padStart(1, '0');
    const minutesRef = useRef("");
    const seconds = String(Math.floor((time / 1000) % 60)).padStart(minutes === '0' ? 1 : 2, '0');
    const secondsRef = useRef("");
    const centiseconds = String(time % 1000).padStart(3, '0').slice(0, 2);
    const centisecondsRef = useRef("");

    const [spaceDown, setSpaceDown] = useState<boolean>(false);
    const spaceRef = useRef(false);

    const [ready, setReady] = useState<number>(0);
    const readyRef = useRef(0);

    const [running, setRunning] = useState<boolean>(false);
    const runningRef = useRef(false);
    const intervalRef = useRef<number | null>(null);

    const [scramble, setScramble] = useState<string>("");
    const scrambleRef = useRef("");

    const [solves, setSolves] = useState<Array<SolveInfo>>([]);

    const [showCard, setShowCard] = useState<boolean>(false);
    const [cardInfo, setCardInfo] = useState<SolveInfo>({ time: "", scramble: "" });
    const [cardIndex, setCardIndex] = useState<number>();

    useEffect(() => {
        spaceRef.current = spaceDown;
    }, [spaceDown]);

    useEffect(() => {
        readyRef.current = ready;
    }, [ready]);

    useEffect(() => {
        scrambleRef.current = scramble;
    }, [scramble]);

    useEffect(() => {
        minutesRef.current = minutes;
        secondsRef.current = seconds;
        centisecondsRef.current = centiseconds;
    }, [minutes, seconds, centiseconds]);

    useEffect(() => {
        runningRef.current = running;
        if (running) {
            intervalRef.current = window.setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [running]);

    useEffect(() => {
        setScramble(generateScramble);

        let timer: number;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === " ") {
                if (runningRef.current) {
                    const solveInfo: SolveInfo = { time: (minutesRef.current !== "0" ? minutesRef.current + ":" : "") + secondsRef.current + "." + centisecondsRef.current, scramble: scrambleRef.current }
                    setSolves(prevSolves => [solveInfo, ...prevSolves]);
                    setRunning(false);
                    setScramble(generateScramble);
                } else if (!spaceRef.current) {
                    setSpaceDown(true);
                    setReady(1);
                    setTime(0);
                    setShowCard(false);
                    timer = window.setTimeout(() => {
                        setReady(2);
                    }, 500);
                }
            } else if (event.key === "Escape") {
                event.preventDefault();
                setTime(0);
                setShowCard(false);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === " ") {
                if (readyRef.current === 2) {
                    setRunning(true);
                }
                window.clearTimeout(timer);
                timer = 0;
                setSpaceDown(false);
                setReady(0);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const handlePlusTwo = () => {
        let newTime = "";
        if (cardInfo.time.indexOf("DNF") !== -1) {
            newTime = String((Number(cardInfo.time.slice(4, cardInfo.time.length - 1)) + 2).toFixed(2)) + "+";
        } else if (cardInfo.time.indexOf("+") === -1) {
            newTime = String((Number(cardInfo.time) + 2).toFixed(2))+ "+";
        } else {
            newTime = String((Number(cardInfo.time.slice(0, cardInfo.time.length - 1)) - 2).toFixed(2));
        }

        setCardInfo(prevInfo => ({ ...prevInfo, time: newTime }));
        setSolves(solves.map((solve, index) => index === cardIndex ? { ...solve, time: newTime } : solve));
    }

    const handleDNF = () => {
        let newTime = "";
        if (cardInfo.time.indexOf("+") !== -1) {
            newTime = "DNF(" + String((Number(cardInfo.time.slice(0, cardInfo.time.length - 1)) - 2).toFixed(2)) + ")";
        } else if (cardInfo.time.indexOf("DNF") === -1) {
            newTime = "DNF(" + cardInfo.time + ")";
        } else {
            newTime = cardInfo.time.slice(4, cardInfo.time.length - 1);
        }

        setCardInfo(prevInfo => ({ ...prevInfo, time: newTime }));
        setSolves(solves.map((solve, index) => index === cardIndex ? { ...solve, time: newTime } : solve));
    }

    return (
        <div className="h-full w-full relative flex flex-col items-center justify-center">
            <div className="h-1/5 w-full flex items-center justify-center text-2xl">{scramble}</div>
            <div className="h-4/5 w-full flex flex-row items-center justify-start text-4xl">
                <div className="h-full w-1/8 overflow-y-auto border border-base-content/5 bg-base-100">
                    <table className="table table-pin-rows text-center">
                        <thead>
                            <tr className="z-3 bg-base-200">
                                <th>#</th>
                                <th>time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solves.map((info: SolveInfo, index: number) => {
                                return (
                                    <tr key={solves.length - index} className="cursor-pointer relative z-2 hover:bg-accent" onClick={(() => {
                                        setCardInfo(info);
                                        setCardIndex(index);
                                        setShowCard(true);
                                    })}>
                                        <th>{solves.length - index}</th>
                                        <th>{info.time}</th>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className={"w-3/4 flex items-center justify-center " + (ready === 1 ? "text-error" : ready === 2 ? "text-success" : "")}>
                    {minutes !== "0" && <span>{minutes}:</span>}
                    {seconds}.{centiseconds}
                </div>
            </div>
            <div className={"absolute h-full w-full flex items-center justify-center z-1 " + (showCard ? "" : "hidden")} onClick={(() => setShowCard(false))}>
            </div>
            <div className={"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 card card-border w-96 bg-base-100 card-xl shadow-xl z-2 " + (showCard ? "" : "hidden")}>
                <div className="card-body">
                    <h2 className="card-title">Time: {cardInfo.time}</h2>
                    <p>Scramble: {cardInfo.scramble}</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary rounded-md" onClick={handlePlusTwo}>+2</button>
                        <button className="btn btn-primary rounded-md" onClick={handleDNF}>DNF</button>
                        <button className="btn btn-error rounded-md" onClick={(() => {
                            setSolves(prevSolves => prevSolves.filter((_, index) => index !== cardIndex));
                            setShowCard(false);
                        })}>X</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timer;
