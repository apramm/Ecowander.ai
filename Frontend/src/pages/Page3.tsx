import {
  Text,
  TextInput,
  Button,
  Stack,
  Container,
  Textarea,
  Center,
} from '@mantine/core';
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

  const handleCommentsChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.currentTarget.value;
    setFormData(prevFormData => ({
      ...prevFormData,
      additionalInfo: value || '', // Ensure it's always a string
    }));
  };

  return (
    <Container size="md">
      <Center>
        <Text
          mb={20}
          size="2rem"
          variant="gradient"
          gradient={{ from: 'lime', to: 'cyan', deg: 90 }}
          style={{ fontWeight: 900 }}
        >
          Additional Information
        </Text>
      </Center>

      <Stack>
        <Text
          size="1.5rem"
          variant="gradient"
          gradient={{ from: 'teal', to: 'green', deg: 90 }}
          style={{ fontWeight: 600 }}
        >
          Must See Places
        </Text>
        <TextInput
          placeholder="Jiro Sushi"
          value={location}
          onChange={e => setLocation(e.currentTarget.value)}
          size="lg"
        />
        <Button
          color="#6E9266"
          onClick={handleAddLocation}
          style={{ width: '100%', maxWidth: '250px', margin: '0 auto' }}
        >
          Add Location
        </Button>

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

        <Text
          size="1.5rem"
          variant="gradient"
          gradient={{ from: 'teal', to: 'green', deg: 90 }}
          style={{ fontWeight: 600 }}
        >
          Additional Comments
        </Text>
        <Textarea
          placeholder="Prefer train over bus."
          value={formData.additionalInfo || ''} // Ensure value is defined
          onChange={handleCommentsChange} // Use the updated handler
          rows={5}
          size="lg"
        />
      </Stack>
    </Container>
  );
};

export default Page3;
