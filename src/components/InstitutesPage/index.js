import { Container } from './styles';

import { deleteInstitute, executeFilter, getInstitute, updateInstitute } from '@/api/institute';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { EditModal } from '../EditModal';
import Table from '../Table';

import { successToast } from '@/utils/toast';
import { useTheme } from 'styled-components';
import SearchBar from '../SearchBar';

export const InstitutesPage = () => {
  const [searchData, setSearchData] = useState({ textSearch: '', field: { value: 'ALL' } });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataToEdit, setDataToEdit] = useState();

  const { data, isFetching, refetch } = useQuery('getInstitutes', () => executeFilter(searchData));

  const theme = useTheme();

  const handleSearch = () => {
    refetch();
  };

  const handleDeleteInstitute = useMutation(async (id) => {
    await deleteInstitute(id);
    successToast('Deletado com sucesso', theme);
    refetch();
  });

  const handleGetInstitute = useMutation(async (id) => {
    const instituteData = await getInstitute(id);
    setDataToEdit(instituteData);
  });

  const handleUpdateInstitute = useMutation(async (inputStates) => {
    await updateInstitute(inputStates.id, inputStates.name, inputStates.acronym);
    successToast('Modificado com sucesso', theme);
    refetch();
  });

  const tableColumns = [
    { heading: 'Nome', value: 'name' },
    { heading: 'Acrônimo', value: 'acronym' },
  ];

  const tableRowOptions = [
    {
      icon: <DeleteIcon fontSize="small" />,
      fn: (id) => handleDeleteInstitute.mutate(id),
    },
    {
      icon: <EditIcon fontSize="small" />,
      fn: (id) => {
        handleGetInstitute.mutate(id);
        setIsModalOpen(true);
      },
    },
  ];

  const searchParams = [
    {
      queryField: 'textSearch',
      type: 'input',
    },
    {
      queryField: 'field',
      type: 'select',
      options: [
        { label: 'Todos', value: 'ALL', default: true },
        { label: 'Nome', value: 'NAME' },
        { label: 'Acrônimo', value: 'ACRONYM' },
      ],
    },
  ];

  return (
    <Container>
      <SearchBar
        params={searchParams}
        data={searchData}
        setData={setSearchData}
        onClick={handleSearch}
      />
      <Table
        columns={tableColumns}
        data={data}
        isFetching={isFetching}
        rowOptions={tableRowOptions}
      />
      <EditModal
        modalTitle={'Editar Instituto'}
        data={dataToEdit}
        columns={tableColumns}
        open={isModalOpen}
        setOpen={setIsModalOpen}
        onSave={handleUpdateInstitute.mutate}
        onFetch={() => getInstitute(dataToEdit)}
      />
    </Container>
  );
};
