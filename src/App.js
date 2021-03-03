import React, {useState, useEffect, useRef} from 'react';
import FlashcardList from './FlashcardList';
import './App.css';
import axios from 'axios';

function App() {

  const [categories, setCategories] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [outof, setSetOutOf] = useState(10);
  const [score, setScore] = useState(0);

  const categoryElement = useRef();
  const ammountElement = useRef();

  useEffect(() => {
    ammountElement.current.value = 10;
    setScore(0);
    axios.get('https://opentdb.com/api_category.php')
    .then(res => {
      setCategories(res.data.trivia_categories);
    })
  }, [])

  useEffect(() => {
    axios.get('https://opentdb.com/api.php?amount=10')
    .then(res => {
      setFlashcards(res.data.results.map( (questonResult, index) => {
        const answer = decodeString(questonResult.correct_answer);
        const options = [
          ...questonResult.incorrect_answers.map(ia => decodeString(ia)), 
          answer];
        return {
          id: `${index}-${Date.now()}`,
          question: decodeString(questonResult.question),
          options: options.sort(() => Math.random() - 0.5),
          answer: answer
        };
      }));
    })
  }, []);


  function decodeString(str) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value;
  }

  function handleSubmit(e) {
    e.preventDefault();

    setSetOutOf(ammountElement.current.value);
    setScore(0);

    axios.get('https://opentdb.com/api.php', {
      params:{
        amount: ammountElement.current.value,
        category: categoryElement.current.value
      }
    })
    .then(res => {
      setFlashcards(res.data.results.map( (questonResult, index) => {
        const answer = decodeString(questonResult.correct_answer);
        const options = [
          ...questonResult.incorrect_answers.map(ia => decodeString(ia)), 
          answer];
        return {
          id: `${index}-${Date.now()}`,
          question: decodeString(questonResult.question),
          options: options.sort(() => Math.random() - 0.5),
          answer: answer
        };
      }));
    })
  }

  function percentage() {
    return Math.round((100 * score) / outof );
  }


  return (
    <>
    <form action="" className="header" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="category">Category </label>
        <select name="" id="category" ref={categoryElement}>
          {categories.map(category => {
            return <option value={category.id} key={category.id}>{category.name}</option>
          })}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="amount">Number of Questions </label>
        <input type="number" id="amount" min="1" step="1" defaultValue="10" ref={ammountElement}/>
      </div>

      <div className="form-group">
        <button className="button">Generate</button>
      </div>
    </form>
    <div className="container">
      <FlashcardList flashcards={flashcards} outof={outof} score={score} setScore={setScore} />
      { flashcards.length > 0 ? (
          <div className="yourscore">
            Your have scored {score} out of {outof} ( {percentage()}% )
          </div>
      ): "" }
    </div>
    </>
  );
}

export default App;
