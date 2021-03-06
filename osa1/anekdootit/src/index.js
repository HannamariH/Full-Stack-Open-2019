import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = ({anecdotes}) => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState([0, 0, 0, 0, 0, 0])

  const nextAnecdote = () => {
    const indeksi = Math.floor(Math.random() * anecdotes.length)
    setSelected(indeksi)
  }

  const vote = () => {
    const copy = [...points] 
    let newVotes = copy[selected] + 1 
    copy[selected] = newVotes 
    setPoints(copy) 
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <div>
        <Button handleClick={vote} text="vote" />
        <Button handleClick={nextAnecdote} text="next anecdote" />
        <EnitenAanestetty anecdotes={anecdotes} points={points} />
      </div>      
    </div>
  )
}

const EnitenAanestetty = ({anecdotes, points}) => {

  const suurin = Math.max(...points)

  if (suurin === 0) {
    return (
      <div>
      <h1>Anecdote with most votes</h1>
      <p>No votes yet</p>
      </div>
    )
  }
  return (
    <div>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[points.indexOf(suurin)]}</p>
      <p>has {points[points.indexOf(suurin)]} votes</p>
    </div>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)