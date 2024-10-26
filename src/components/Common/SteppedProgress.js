import React from 'react';

const SteppedProgress = ({ currentStep, totalSteps }) => {
  return (
    <div className="stepped-progress-container">
      <div className="progress-line"></div>
      <div className="steps-container">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          const isLastActive = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="step-item">
              <div className={`step-circle ${isActive ? 'active' : ''}`}>
                {stepNumber}
              </div>
              {stepNumber < totalSteps && (
                <div 
                  className={`connector-line ${isActive && !isLastActive ? 'active' : ''}`}
                  style={{
                    width: `${100 / (totalSteps - 1)}%`,
                    left: `${(stepNumber - 1) * (100 / (totalSteps - 1))}%`
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      
    </div>
  );
};

export default SteppedProgress;