import {
  AppShell,
  Burger,
  Button,
  Center,
  Group,
  Image,
  Text,
} from '@mantine/core';
import LandingPage from './pages/LandingPage';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
// import logo from '../images/logo.png';
import seeding from '../images/seeding.svg';
import { ResponsePage } from './pages/ResponsePage';

export interface FormData {
  startLocation: string; // e.g. "Paris, France" (city, country)
  endLocation: string; // e.g. "New York, United States" (city, country)
  startDate: string | null; // e.g. 2024-02-27
  endDate: string | null;
  budgetInDollars: number; // e.g. 3323233
  numberOfPeople: number;
  scheduleGranularity: number; // 1, 4, 8, 24 (i.e. 1 hour, 4 hours, 8 hours, 24 hours)
  mustSeeAttractions: string[];
  additionalInfo: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [opened, { toggle }] = useDisclosure();
  const [formData, setFormData] = useState<FormData>({
    startLocation: ',',
    endLocation: ',', // e.g. "New York,United States" (city, country)
    startDate: '', // e.g. 2024-02-27
    endDate: '',
    budgetInDollars: 1, // e.g. 3323233
    numberOfPeople: 1,
    scheduleGranularity: 0, // 1, 4, 8, 24 (i.e. 1 hour, 4 hours, 8 hours, 24 hours)
    mustSeeAttractions: [],
    additionalInfo: '',
  });
  const [llmResponse, setLlmResponse] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const steps = [
    {
      id: 1,
      content: 'Step 1',
      component: (
        <LandingPage
          formData={formData}
          setFormData={setFormData}
          onNext={handleNext}
        />
      ),
    },
    {
      id: 2,
      content: 'Step 2',
      component: <Page1 formData={formData} setFormData={setFormData} />,
    },
    {
      id: 3,
      content: 'Step 3',
      component: <Page2 formData={formData} setFormData={setFormData} />,
    },
    {
      id: 4,
      content: 'Step 4',
      component: <Page3 formData={formData} setFormData={setFormData} />,
    },
    {
      id: 5,
      content: 'Step 5',
      component: <ResponsePage llmResponse={llmResponse} />,
    },
  ];

  console.log(formData);

  const variants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  const handleSubmit = async () => {
    setLlmResponse('');
    handleNext();
    try {
      const response = await axios.post(
        'http://35.163.46.241:5000/generate-trip',
        formData
      );
      console.log(response.data.response);
      setLlmResponse(response.data.response);
    } catch (e) {
      console.log('Error: ', e);
    }
  };

  return (
    <>
      <AppShell header={{ height: 80 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Image
              src={seeding}
              alt="Ecowander Logo"
              width={40}
              height={40}
              style={{
                objectFit: 'contain',
                color: 'cyan',
              }}
            />
            <Text
              size="2rem"
              variant="gradient"
              gradient={{ from: 'lime', to: 'cyan', deg: 90 }}
              style={{ fontWeight: 300 }}
            >
              ecowander.ai
            </Text>
          </Group>
        </AppShell.Header>
        <AppShell.Main mt={30}>
          <motion.div
            key={currentStep}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5 }}
          >
            {steps[currentStep].component}
          </motion.div>

          <Center mt="md">
            <Group>
              {currentStep != 0 ? (
                <Button
                  variant="default"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  size="lg"
                  w={200}
                >
                  Back
                </Button>
              ) : null}

              {currentStep < 3 && currentStep > 0 ? (
                <Button
                  onClick={handleNext}
                  disabled={currentStep === steps.length - 1}
                  size="lg"
                  w={200}
                  variant="gradient"
                  gradient={{ from: 'lime', to: 'cyan', deg: 90 }}
                >
                  Next
                </Button>
              ) : currentStep === 3 ? (
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  variant="gradient"
                  w={200}
                  gradient={{ from: 'lime', to: 'cyan', deg: 90 }}
                >
                  Submit
                </Button>
              ) : null}
            </Group>
          </Center>
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default App;
