import {
  Text,
  TextInput,
  Button,
  Stack,
  Container,
  Textarea,
  Center,
  Flex,
  List,
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
    <Container size="md" h="70vh" style={{ overflow: 'auto' }}>
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
        <Flex gap={20}>
          <TextInput
            placeholder="Jiro Sushi"
            value={location}
            onChange={e => setLocation(e.currentTarget.value)}
            size="lg"
            flex={1}
          />
          <Button
            onClick={handleAddLocation}
            size="lg"
            variant="outline"
            color="cyan"
          >
            Add Location
          </Button>
        </Flex>

        <Center>
          <List>
            {locations.map((loc, index) => (
              <List.Item
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 30,
                }}
              >
                <Text display={'inline-block'}>{loc}</Text>
                <Button
                  color="red"
                  variant="outline"
                  onClick={() => handleRemoveLocation(index)}
                  ml={50}
                >
                  Remove
                </Button>
              </List.Item>
            ))}
          </List>
        </Center>

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
