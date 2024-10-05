import { Box, Title, Text, TextInput, Button, Stack } from '@mantine/core';
import { FormData } from '../App';
import { useState } from 'react';

interface Page3Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Page3: React.FC<Page3Props> = ({ formData, setFormData }) => {
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState<string[]>(
    formData.mustSeeAttractions || []
  );

  const handleAddLocation = () => {
    if (location.trim() !== '') {
      const newLocations = [...locations, location];
      setLocations(newLocations);
      setFormData(prevFormData => ({
        ...prevFormData,
        mustSeeAttractions: newLocations,
      }));
      setLocation(''); // Clear the input after adding
    }
  };

  const handleRemoveLocation = (index: number) => {
    const newLocations = locations.filter((_, i) => i !== index);
    setLocations(newLocations);
    setFormData(prevFormData => ({
      ...prevFormData,
      mustSeeAttractions: newLocations,
    }));
  };

  const handleCommentsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setFormData(prevFormData => ({
      ...prevFormData,
      additionalInfo: value || '', // Ensure it's always a string
    }));
  };

  return (
    <Box
      mt="md"
      p="xl"
      style={{
        border: '1px solid #eef6ef',
        borderRadius: '8px',
        backgroundColor: '#eef6ef',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
      }}
    >
      <Title
        order={4}
        mb="lg"
        style={{ textAlign: 'center', color: '#6E9266' }}
      >
        Must-See Locations and Comments
      </Title>

      <Stack>
        <Text mb="xs" c="#6E9266">
          Must-See Locations
        </Text>
        <TextInput
          placeholder="Enter a must-see location"
          value={location}
          onChange={e => setLocation(e.currentTarget.value)}
          style={{ width: '100%', maxWidth: '250px', margin: '0 auto' }} // Centered
        />
        <Button
          color="#6E9266"
          onClick={handleAddLocation}
          style={{ width: '100%', maxWidth: '250px', margin: '0 auto' }}
        >
          Add Location
        </Button>

        <Text mb="xs" c="#6E9266">
          Current Locations:
        </Text>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {locations.map((loc, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {loc}
              <Button
                color="red"
                variant="outline"
                onClick={() => handleRemoveLocation(index)}
                style={{ marginLeft: '10px' }}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>

        <Text mb="xs" c="#6E9266">
          Additional Comments
        </Text>
        <TextInput
          placeholder="Enter any additional comments"
          value={formData.additionalInfo || ''} // Ensure value is defined
          onChange={handleCommentsChange} // Use the updated handler
          style={{ width: '100%', maxWidth: '250px', margin: '0 auto' }} // Centered
        />
      </Stack>
    </Box>
  );
};

export default Page3;
