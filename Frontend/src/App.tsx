import {
  AppShell,
  Burger,
  Button,
  Center,
  Container,
  Group,
  Text,
} from '@mantine/core';
import LandingPage from './pages/LandingPage';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDisclosure } from '@mantine/hooks';

const steps = [
  { id: 1, content: 'Step 1', component: <LandingPage /> },
  { id: 2, content: 'Step 2', component: <LandingPage /> },
  { id: 3, content: 'Step 3', component: <LandingPage /> },
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [opened, { toggle }] = useDisclosure();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

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

  const variants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <>
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text size="xl">Ecowander.ai</Text>
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <Container size="md">
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
                <Button
                  variant="default"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={currentStep === steps.length - 1}
                >
                  Next
                </Button>
              </Group>
            </Center>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default App;
