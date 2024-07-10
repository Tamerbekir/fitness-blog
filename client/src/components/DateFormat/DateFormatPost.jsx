
const DateFormatPost = ({ createdAt }) => {
  const date = new Date(parseInt(createdAt));

  return (
    <a className="text-center">{date.toLocaleDateString('en-US', 
    { year: 'numeric', month: 'long', day: 'numeric' })}</a>
  )
}

export default DateFormatPost
