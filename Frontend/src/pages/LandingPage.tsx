import {
  Box,
  Select,
  TextInput,
  Title,
  Flex,
  Button,
  Text,
  Center,
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
  onNext: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  formData,
  setFormData,
  onNext,
}) => {
  return (
    <>
      <Flex
        direction={'row'}
        style={{
          height: '85vh',
        }}
      >
        <Box
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            padding: '20px',
            borderRadius: '20px',
            flex: 1,
            backgroundImage: "url('../../images/background.png')",
          }}
        >
          <Title order={1} fw={'bold'} size={'3rem'}>
            Plan your next trip. Sustainably.
          </Title>
        </Box>

        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '40px',
            flex: 1,
            backgroundColor: 'rgba(255, 255, 255, 1)',
            margin: 20,
            borderRadius: 20,
            height: 'fit-content',
          }}
        >
          <Text
            mb={20}
            size="2rem"
            variant="gradient"
            gradient={{ from: 'lime', to: 'cyan', deg: 90 }}
            style={{ fontWeight: 900 }}
          >
            Starting Point
          </Text>
          <Select
            placeholder="Country"
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
            size="xl"
            mb="md" // Adds margin to the bottom
          />
          <TextInput
            placeholder="City"
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
            mb="4rem" // Adds margin to the bottom for spacing
            size="xl"
          />
          <Text
            mb={20}
            size={'2rem'}
            variant="gradient"
            gradient={{ from: 'lime', to: 'cyan', deg: 90 }}
            style={{ fontWeight: 900 }}
          >
            Destination
          </Text>
          <Select
            placeholder="Country"
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
            size="xl"
          />
          <TextInput
            placeholder="City"
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
            mb="4rem"
            size="xl"
          />
          <Center>
            <Button
              onClick={onNext}
              size="xl"
              fullWidth
              variant="gradient"
              gradient={{ from: 'green', to: 'lime', deg: 90 }}
            >
              Start!
            </Button>
          </Center>
        </Box>
      </Flex>
    </>
  );
};

export default LandingPage;
