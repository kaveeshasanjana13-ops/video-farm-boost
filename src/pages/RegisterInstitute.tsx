import React from 'react';
import { useNavigate } from 'react-router-dom';
import InstituteRegistration from '@/components/InstituteRegistration';

const RegisterInstitute: React.FC = () => {
  const navigate = useNavigate();

  return (
    <InstituteRegistration
      onBack={() => navigate('/')}
      onComplete={() => {
        navigate('/', { replace: true });
      }}
    />
  );
};

export default RegisterInstitute;
