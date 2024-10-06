import { Text, TextInput, Container, Center } from '@mantine/core';
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
      budgetInDollars: isNaN(value) ? 0 : value,
    }));
  };

  const handleNumberOfPeopleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.currentTarget.value, 10);
    setFormData(prevFormData => ({
      ...prevFormData,
      numberOfPeople: isNaN(value) ? 0 : value,
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
          Budget and Party Size
        </Text>
      </Center>
      <Text
        mb={20}
        size="1.5rem"
        variant="gradient"
        gradient={{ from: 'teal', to: 'green', deg: 90 }}
        style={{ fontWeight: 600 }}
      >
        Budget
      </Text>
      <TextInput
        required
        type="number"
        placeholder="Enter your budget"
        value={formData.budgetInDollars.toString()} // Convert number to string for input
        onChange={handleBudgetChange}
        mb={20}
        size="lg"
      />
      <Text
        mb={20}
        size="1.5rem"
        variant="gradient"
        gradient={{ from: 'teal', to: 'green', deg: 90 }}
        style={{ fontWeight: 600 }}
      >
        Number of People
      </Text>
      <TextInput
        required
        type="number"
        placeholder="Enter number of people"
        value={formData.numberOfPeople.toString()} // Convert number to string for input
        onChange={handleNumberOfPeopleChange}
        mb="md"
        size="lg"
      />
    </Container>
  );
};

export default Page2;
