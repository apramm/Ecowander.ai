import { Box, Title, Text, TextInput } from '@mantine/core';
import { FormData } from '../App';

interface Page2Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Page2: React.FC<Page2Props> = ({ formData, setFormData }) => {
  const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.currentTarget.value, 10);
    setFormData(prevFormData => ({
      ...prevFormData,
      budgetInDollars: isNaN(value) ? 0 : value, // Default to 0 if not a valid number
    }));
  };

  const handleNumberOfPeopleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.currentTarget.value, 10);
    setFormData(prevFormData => ({
      ...prevFormData,
      numberOfPeople: isNaN(value) ? 1 : value, // Default to 1 if not a valid number
    }));
  };

  return (
    <Box
      mt="md"
      p="xl"
      style={{
        border: '1px solid #eaecef',
        borderRadius: '8px',
        backgroundColor: '#e3f2fd', // Light blue background
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
      }}
    >
      <Title
        order={4}
        mb="lg"
        style={{ textAlign: 'center', color: '#1e88e5' }}
      >
        Logistics
      </Title>

      <Text mb="xs" color="#1976d2">
        Budget (in dollars)
      </Text>
      <TextInput
        type="number"
        placeholder="Enter your budget"
        value={formData.budgetInDollars.toString()} // Convert number to string for input
        onChange={handleBudgetChange}
        mb="md"
        style={{ width: '100%', maxWidth: '250px', margin: '0 auto' }} // Centered
      />

      <Text mb="xs" color="#1976d2">
        Number of People
      </Text>
      <TextInput
        type="number"
        placeholder="Enter number of people"
        value={formData.numberOfPeople.toString()} // Convert number to string for input
        onChange={handleNumberOfPeopleChange}
        mb="md"
        style={{ width: '100%', maxWidth: '250px', margin: '0 auto' }} // Centered
      />
    </Box>
  );
};

export default Page2;
