import { Title, TextInput, Container } from '@mantine/core';
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
      <Title
        order={4}
        mb="lg"
        style={{ textAlign: 'center', color: '#6E9266' }}
      >
        Logistics
      </Title>
      <TextInput
        required
        label="Enter Budget"
        type="number"
        placeholder="Enter your budget"
        value={formData.budgetInDollars.toString()} // Convert number to string for input
        onChange={handleBudgetChange}
        mb="md"
        style={{ width: '100%', maxWidth: '250px', margin: '0 auto' }} // Centered
      />
      <TextInput
        required
        label="Number of People"
        type="number"
        placeholder="Enter number of people"
        value={formData.numberOfPeople.toString()} // Convert number to string for input
        onChange={handleNumberOfPeopleChange}
        mb="md"
        style={{ width: '100%', maxWidth: '250px', margin: '0 auto' }} // Centered
      />
    </Container>
  );
};

export default Page2;
