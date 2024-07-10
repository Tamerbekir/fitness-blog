const DateFormat = ({ createdAt }) => {

  // const createdAt = data.me.createdAt

  return (
    <a>{new Date(parseInt(createdAt)).toLocaleString('en-US', 
    { year: 'numeric', month: 'long', day: 'numeric'})}</a>
  
  )
}

export default DateFormat