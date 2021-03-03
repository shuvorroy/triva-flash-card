import React from 'react'
import Flashcard from './Flashcard'

export default function FlashcardList({flashcards, outof, score, setScore}) {
    return (
        <div className="card-grid">
            {flashcards.map((flashcard) => {
                return(
                    <Flashcard flashcard={flashcard} key={flashcard.id} score={score} setScore={setScore}/>
                )
            })}
        </div>
    )
}
