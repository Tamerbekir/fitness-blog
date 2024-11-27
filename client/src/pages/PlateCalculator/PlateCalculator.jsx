import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import button from "react-bootstrap/ button";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { toast, Slide } from "react-toastify";
import './assets/plateCalculator.css'

export default function PlateCalculator() {

  const [totalWeight, setTotalWeight] = useState(() => {
    const savedTotal = localStorage.getItem('userTotalWeight')
    return savedTotal ? JSON.parse(savedTotal) : '0'
  })

  const [activityWeight, setActivityWeight] = useState(() => {
    const savedUserWeight = localStorage.getItem('userWeight')
    return savedUserWeight ? JSON.parse(savedUserWeight)
      :
      {
        //bar weight
        barWeight: '0',
        //plate weight
        firstPlateWeight: '',
        secondPlateWeight: '',
        thirdPlateWeight: '',
        fourthPlateWeight: '',
        fifthPlateWeight: '',
        sixthPlateWeight: '',
        //plates added
        firstPlateAdded: '',
        secondPlateAdded: '',
        thirdPlateAdded: '',
        fourthPlateAdded: '',
        fifthPlateAdded: '',
        sixthPlateAdded: '',
      }
  })

  useEffect(() => {
    if (activityWeight) {
      localStorage.setItem('userWeight', JSON.stringify(activityWeight))
    }

  }, [activityWeight])


  useEffect(() => {
    if (totalWeight) {
      localStorage.setItem('userTotalWeight', JSON.stringify(totalWeight))
    }
  }, [totalWeight])


  const handleActivityWeightChange = (event) => {
    const { name, value } = event.target
    setActivityWeight({
      ...activityWeight,
      [name]: value
    })
  }

  const handleClearInput = (name) => {
    setActivityWeight({
      ...activityWeight,
      [name]: ''
    })
  }


  const calculateTotal = () => {
    const plateWeight =
      parseFloat(activityWeight.firstPlateWeight || 0) * parseInt(activityWeight.firstPlateAdded || 0) +
      parseFloat(activityWeight.secondPlateWeight || 0) * parseFloat(activityWeight.secondPlateAdded || 0) +
      parseFloat(activityWeight.thirdPlateWeight || 0) * parseFloat(activityWeight.thirdPlateAdded || 0) +
      parseFloat(activityWeight.fourthPlateWeight || 0) * parseFloat(activityWeight.fourthPlateAdded || 0) +
      parseFloat(activityWeight.fifthPlateWeight || 0) * parseFloat(activityWeight.fifthPlateAdded || 0) +
      parseFloat(activityWeight.sixthPlateWeight || 0) * parseFloat(activityWeight.sixthPlateAdded || 0);


    if (activityWeight.firstPlateWeight && !activityWeight.firstPlateAdded
      || activityWeight.secondPlateWeight && !activityWeight.secondPlateAdded
      || activityWeight.thirdPlateWeight && !activityWeight.thirdPlateAdded
      || activityWeight.fourthPlateAdded && !activityWeight.fourthPlateAdded
      || activityWeight.fifthPlateWeight && !activityWeight.fifthPlateAdded
      || activityWeight.sixthPlateWeight && !activityWeight.sixthPlateAdded
    ) {
      toast.error('Missing Plate Amount', {
        autoClose: 1200,
        hideProgressBar: true,
        position: 'bottom-right',
        transition: Slide,
      })
      return
    }
    if (!activityWeight.barWeight) {
      toast.error('Missing Bar Weight (0 if not needed)', {
        autoClose: 1200,
        hideProgressBar: true,
        position: 'bottom-right',
        transition: Slide,
      })
      return
    }

    const totalWeight = plateWeight + parseFloat(activityWeight.barWeight || 0);
    setTotalWeight(totalWeight);
  }





  const navigate = useNavigate()
  return (
    <div className="weightCalDIv">
      <h1 style={{ color: 'white' }}>Plate Calculator</h1>
      <div>
        <InputGroup className="mb-3">
          <InputGroup.Text>Bar (lb)</InputGroup.Text>
          <Form.Control
            type="number"
            inputmode="numeric"
            pattern="[0-9]*"
            name="barWeight"
            value={activityWeight.barWeight}
            onChange={handleActivityWeightChange}
          />
          < button
            className="clearButton"
            onClick={() => handleClearInput('barWeight')}
          >Clear</ button>
        </InputGroup>
      </div>
      <div>
        <InputGroup className="mb-3">
          <InputGroup.Text>Plate (lb)</InputGroup.Text>
          <Form.Control
            type="number"
            inputmode="numeric"
            pattern="[0-9]*"
            name="firstPlateWeight"
            value={activityWeight.firstPlateWeight}
            onChange={handleActivityWeightChange}
          />
          < button
            className="clearButton"
            onClick={() => handleClearInput('firstPlateWeight')}
          >Clear</ button>
          <InputGroup.Text>x</InputGroup.Text>
          <Form.Control
            type="number"
            inputmode="numeric"
            pattern="[0-9]*"
            name="firstPlateAdded"
            value={activityWeight.firstPlateAdded}
            onChange={handleActivityWeightChange}
          />
          {/* < button onClick={addPlate}>+</ button> */}
          < button
            className="clearButton"
            onClick={() => handleClearInput('firstPlateAdded')}
          >Clear</ button>
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Plate (lb)</InputGroup.Text>
          <Form.Control
            type="number"
            inputmode="numeric"
            pattern="[0-9]*"
            name="secondPlateWeight"
            value={activityWeight.secondPlateWeight}
            onChange={handleActivityWeightChange}
          />
          < button
            className="clearButton"
            onClick={() => handleClearInput('secondPlateWeight')}
          >Clear</ button>
          <InputGroup.Text>x</InputGroup.Text>
          <Form.Control
            type="number"
            inputmode="numeric"
            pattern="[0-9]*"
            name="secondPlateAdded"
            value={activityWeight.secondPlateAdded}
            onChange={handleActivityWeightChange}
          />
          < button
            className="clearButton"
            onClick={() => handleClearInput('secondPlateAdded')}
          >Clear</ button>
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Plate (lb)</InputGroup.Text>
          <Form.Control
            type="number"
            inputmode="numeric"
            pattern="[0-9]*"
            name="thirdPlateWeight"
            value={activityWeight.thirdPlateWeight}
            onChange={handleActivityWeightChange}
          />
          < button
            className="clearButton"
            onClick={() => handleClearInput('thirdPlateWeight')}
          >Clear</ button>
          <InputGroup.Text>x</InputGroup.Text>
          <Form.Control
            type="number"
            inputmode="numeric"
            pattern="[0-9]*"
            name="thirdPlateAdded"
            value={activityWeight.thirdPlateAdded}
            onChange={handleActivityWeightChange}
          />
          < button
            className="clearButton"
            onClick={() => handleClearInput('thirdPlateAdded')}
          >Clear</ button>
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Plate (lb)</InputGroup.Text>
          <Form.Control
            type="number"
            inputmode="numeric"
            pattern="[0-9]*"
            name="fourthPlateWeight"
            value={activityWeight.fourthPlateWeight}
            onChange={handleActivityWeightChange}
          />
          < button
            className="clearButton"
            onClick={() => handleClearInput('fourthPlateWeight')}
          >Clear</ button>
          <InputGroup.Text>x</InputGroup.Text>
          <Form.Control
            type="number"
            inputmode="numeric"
            pattern="[0-9]*"
            name="fourthPlateAdded"
            value={activityWeight.fourthPlateAdded}
            onChange={handleActivityWeightChange}
          />
          < button
            className="clearButton"
            onClick={() => handleClearInput('fourthPlateAdded')}
          >Clear</ button>
        </InputGroup>
        {/* <InputGroup className="mb-3">
          <InputGroup.Text>Plate (lb)</InputGroup.Text>
          <Form.Control
            name="fifthPlateWeight"
            value={activityWeight.fifthPlateWeight}
            onChange={handleActivityWeightChange}
          />
          < button
            variant="secondary"
            onClick={() => handleClearInput('fifthPlateWeight')}
          >Clear</ button>
          <InputGroup.Text>x</InputGroup.Text>
          <Form.Control
            name="fifthPlateAdded"
            value={activityWeight.fifthPlateAdded}
            onChange={handleActivityWeightChange}
          />
          < button
            variant="secondary"
            onClick={() => handleClearInput('fifthPlateAdded')}
          >Clear</ button>
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Plate (lb)</InputGroup.Text>
          <Form.Control
            name="sixthPlateWeight"
            value={activityWeight.sixthPlateWeight}
            onChange={handleActivityWeightChange}
          />
          < button
            variant="secondary"
            onClick={() => handleClearInput('sixthPlateWeight')}
          >Clear</ button>
          <InputGroup.Text>x</InputGroup.Text>
          <Form.Control
            name="sixthPlateAdded"
            value={activityWeight.sixthPlateAdded}
            onChange={handleActivityWeightChange}
          />
          < button
            variant="secondary"
            onClick={() => handleClearInput('sixthPlateAdded')}
          >Clear</ button>
        </InputGroup> */}
        <div className="totalDiv">
          <h2 style={{ color: 'white' }}>Total Weight - {totalWeight} lbs</h2>
        </div>
      </div>
      <div className="divBtns">
        < button
          className="backBtn"
          onClick={() => navigate('/log-workout')}
        >Back</ button>
        < button
          className="calculateBtn"
          onClick={() => {
            calculateTotal()
            // checkFields()
          }}
        >Calculate</ button>
      </div>
    </div >
  )
}