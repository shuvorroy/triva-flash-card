import React, {useState, useEffect, useRef} from 'react'

export default function Flashcard({flashcard, score, setScore}) {
    const [flip, setFlip] = useState(false);
    const [wrong, setWrong] = useState('');
    const [height, setHeight] = useState('initial');
    const [selected, setSelected] = useState('');
    const frontElement = useRef();
    const backElement = useRef();

    function setMaxHeight() {
        const frontHeight = frontElement.current.getBoundingClientRect().height;
        const backHeight = backElement.current.getBoundingClientRect().height;
        setHeight(Math.max(frontHeight, backHeight, 100));
    }

    useEffect(() => {
        setMaxHeight();
    }, [flashcard.question, flashcard.answer, flashcard.option]);

    useEffect(() => {
        window.addEventListener('resize', setMaxHeight)
        return () => window.removeEventListener('resize', setMaxHeight)
    }, []);

    useEffect(() => {
        setSelected(flashcard.options.map((option, index) => {
            return option
        }));
    }, [])

    return (
        <div 
        style={{height: `${height}px`}}
        className={`card ${flip ? 'flip' : ''}`}
        >
            <div className={`front ${wrong}`} ref={frontElement}>
                {flashcard.question}
                <div className="flashcard-opitons">
                    {flashcard.options.map((option, index) => {
                        return <div 
                        key={option} 
                        className={`flashcard-opiton ${selected === option ? 'selected': ''}`} onClick={() => {
                            setWrong(option !== flashcard.answer ? 'wrong': 'right');
                            setScore(option !== flashcard.answer ? score: score + 1);
                            setSelected(option);
                        }}
                        >{option}</div>
                    })}
                </div>

                {wrong === 'wrong' ? (
                <div className="show-answer" onClick={() => setFlip(!flip)}>
                    Show Answer
                </div>
                ): ""}
            </div>
            <div className="back" ref={backElement}>
                {flashcard.answer}

                <div className="show-answer" onClick={() => setFlip(!flip)}>
                    Hide Answer
                </div>
            </div>
        </div>
    )
}
