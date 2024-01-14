import { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function useProtectedApi(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    axios.get(url)
      .then(response => {
        setData(response.data);
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          history.push('/login');
        } else {
          setError(err);
        }
      });
  }, [url, history]);

  return { data, error };
}

export default useProtectedApi;