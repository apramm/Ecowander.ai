import {
  Box,
  Select,
  TextInput,
  Title,
  Container,
  Button,
  Divider,
} from '@mantine/core';
import { countries } from './Countries.tsx';
import { FormData } from '../App';

const countryOptions = countries.map(country => ({
  value: country,
  label: country,
}));

interface LandingPageProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const LandingPage: React.FC<LandingPageProps> = ({ formData, setFormData }) => {
  return (
    <Container size="sm" mt="xl">
      <Title order={2}>Welcome to the Travel Planner</Title>

      <Box mt="md">
        <Title order={4}>Starting Location</Title>
        <Select
          label="Select Starting Country"
          placeholder="Choose a country"
          data={countryOptions}
          value={formData.startLocation.split(',')[0]}
          onChange={value =>
            setFormData(prevFormData => {
              const prevCity = prevFormData.startLocation.split(',')[1];
              return {
                ...prevFormData,
                startLocation: `${value},${prevCity}`,
              };
            })
          }
          mb="md" // Adds margin to the bottom
        />

        <TextInput
          label="Enter Starting City"
          placeholder="Type your city"
          value={formData.startLocation.split(',')[1]}
          onChange={event =>
            setFormData(prevFormData => {
              const prevCountry = prevFormData.startLocation.split(',')[0];
              return {
                ...prevFormData,
                startLocation: `${prevCountry},${event.currentTarget.value}`,
              };
            })
          }
          mb="lg" // Adds margin to the bottom for spacing
        />

        <Divider my="lg" />

        <Title order={4}>Destination Location</Title>
        <Select
          label="Select Destination Country"
          placeholder="Choose a country"
          data={countryOptions}
          value={formData.endLocation.split(',')[1]}
          onChange={value =>
            setFormData(prevFormData => {
              const prevCity = prevFormData.endLocation.split(',')[0];
              return {
                ...prevFormData,
                endLocation: `${prevCity},${value}`,
              };
            })
          }
          mb="md"
        />

        <TextInput
          label="Enter Destination City"
          placeholder="Type your city"
          value={formData.endLocation.split(',')[0]}
          onChange={event =>
            setFormData(prevFormData => {
              const prevCountry = prevFormData.endLocation.split(',')[1];
              return {
                ...prevFormData,
                endLocation: `${event.currentTarget.value},${prevCountry}`,
              };
            })
          }
          mb="lg"
        />
      </Box>

      <Button fullWidth mt="md">
        Plan Your Trip
      </Button>
    </Container>
  );
};

export default LandingPage;
