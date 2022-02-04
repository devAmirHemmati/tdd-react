import axios from 'axios';
import i18n from 'i18next';

export const apiPostUserRegister = async (body) => {
  const response = await axios.post(`/api/1.0/users`, body, {
    headers: {
      'Accept-Language': i18n.language,
    },
  });

  return response;
};
