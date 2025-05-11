import { useState } from 'react';
import { Button, Popover, OverlayTrigger } from 'react-bootstrap';
import { SketchPicker } from 'react-color';

export const ColorPicker = ({ selectedColor, onColorChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleColorChange = (color) => {
    onColorChange(color.hex);
  };

  const popover = (
    <Popover id="color-picker-popover">
      <Popover.Body>
        <SketchPicker 
          color={selectedColor} 
          onChangeComplete={handleColorChange} 
          presetColors={[
            '#FF6900', '#FCB900', '#7BDCB5', '#00D084',
            '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C',
            '#F78DA7', '#9900EF', '#563d7c', '#343a40'
          ]}
        />
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      overlay={popover}
      show={showPicker}
      onToggle={setShowPicker}
      rootClose
    >
      <Button
        variant="outline-secondary"
        style={{
          width: '100%',
          backgroundColor: selectedColor,
          borderColor: '#ced4da',
        }}
      >
        <div 
          style={{
            width: '100%',
            height: '24px',
            backgroundColor: selectedColor,
          }}
        />
      </Button>
    </OverlayTrigger>
  );
};