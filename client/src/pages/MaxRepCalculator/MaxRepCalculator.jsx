import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Calculator() {

  const navigate = useNavigate()

  const [displayMax, setDisplayMax] = useState('');

  const [maxLift, setMaxLift] = useState({
    maxLb: '',
    maxReps: '',
  });

  const handleMaxLiftChange = event => {
    const { name, value } = event.target;
    setMaxLift({
      ...maxLift,
      [name]: parseFloat(value),
    });
  };
  //  weight × (1 + (0.0333 × number of reps)
  const handleSubmitMaxLift = () => {
    setDisplayMax(maxLift.maxLb * (1 + 0.0333 * maxLift.maxReps));
  };
  console.log(maxLift.maxLb * (1 + 0.0333 * maxLift.maxReps));

  const percentage = [
    { percent: 100, rep: 1 },
    { percent: 95, rep: 2 },
    { percent: 90, rep: 4 },
    { percent: 85, rep: 6 },
    { percent: 80, rep: 8 },
    { percent: 75, rep: 10 },
    { percent: 70, rep: 12 },
    { percent: 65, rep: 16 },
    { percent: 60, rep: 20 },
    { percent: 55, rep: 24 },
    { percent: 50, rep: 30 },
  ];

  return (
    <div className='maxRepDiv'>
      <h1 style={{ padding: '10px', color: 'white' }}>Max Rep Calculator</h1>
      <div style={{ margin: '2%', color: 'white' }}>
        <small>
          Calculate your one-rep max (1RM) for any lift. Your one-rep max is the
          max weight you can lift for a single repetition for a given exercise.
        </small>
      </div>
      <div style={{ padding: '5px' }}>
        <InputGroup style={{ padding: '10px' }}>
          <Form.Control
            type='number'
            inputmode="numeric"
            pattern="[0-9]*"
            name='maxLb'
            onChange={handleMaxLiftChange}
            placeholder='Max Lift (lb)'
          />
        </InputGroup>
        <InputGroup style={{ padding: '10px' }}>
          <Form.Control
            type='number'
            inputmode="numeric"
            pattern="[0-9]*"
            name='maxReps'
            onChange={handleMaxLiftChange}
            placeholder='Repetitions'
          />
        </InputGroup>
      </div>
      <div>
        <Button
          style={{ margin: '2%', fontSize: '15px' }}
          variant='success'
          onClick={handleSubmitMaxLift}
        >
          Calculate
        </Button>
        <Button variant='success' onClick={() => navigate('/log-workout')} >Back</Button>
        <div style={{ margin: '2%', color: 'white' }}>
          {displayMax && (
            <div>
              <p>Your max weight is {maxLift.maxLb} lb with a max repetition(s) of {maxLift.maxReps}.</p>
            </div>
          )}
        </div>
        <div>
          <ListGroup style={{ margin: '10%', width: '80%' }}>
            {/* <h5 style={{ color: 'white' }}>Percent - Weight(lb) - Rep(s)</h5> */}
            {displayMax &&
              percentage.map(({ percent: percent, rep }) => (
                <ListGroup.Item key={percent} style={{ display: 'flex', justifyContent: 'center' }}>
                  <p style={{ padding: '20px' }}>{percent}% </p>
                  <p style={{ padding: '20px' }}>{Math.round(displayMax * (percent / 100))} lb</p>
                  <p style={{ padding: '20px' }}>{rep} reps</p>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </div>
      </div>
    </div>
  );
}
