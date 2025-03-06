import {useState, useEffect} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Form, Input, Button, Select, Spin, message} from 'antd';
import {ADD_CAR, UPDATE_CAR} from '../graphql/mutations';
import {GET_PEOPLE, GET_PEOPLE_WITH_CARS} from '../graphql/queries';
import type {Person, Car} from '../types';

type Props = {
  personId?: string;
  car?: Car;
  onEditComplete?: () => void;
};

const CarForm = ({personId, car, onEditComplete}: Props) => {
  const {data, loading, error} = useQuery(GET_PEOPLE);
  const [form] = Form.useForm();
  const [, contextHolder] = message.useMessage();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    forceUpdate({});
  }, []);

  const [addCar] = useMutation(ADD_CAR, {
    // Appolo Client Cache update
    update(cache, {data}) {
      if (!data?.addCar) return;

      const existingData = cache.readQuery<{people: Person[]}>({
        query: GET_PEOPLE_WITH_CARS,
      });
      if (!existingData || !existingData.people) return;
      const updatedData = existingData.people.map(person =>
        person.id === data.addCar.person.id
          ? {...person, cars: [...person.cars, data.addCar]}
          : person,
      );
      cache.writeQuery({
        query: GET_PEOPLE_WITH_CARS,
        data: {people: updatedData},
      });
    },
    onCompleted: () => {
      message.success('Car added successfully');
      form.resetFields();
    },
    onError: error => message.error(`Error: ${error.message}`),
  });

  const [updateCar] = useMutation(UPDATE_CAR, {
    onCompleted: () => {
      message.success('Car updated successfully');
      form.resetFields();
      if (onEditComplete) onEditComplete();
    },
    onError: error => message.error(`Error: ${error.message}`),
  });

  const onFinish = (values: Car) => {
    const {year, make, model, price, personId} = values;
    if (car) {
      updateCar({variables: {id: car.id, year, make, model, price, personId}});
    } else {
      addCar({variables: {...values}});
      form.resetFields();
    }
  };

  if (loading) return <Spin size="small" style={styles.spinner} />;
  if (error) {
    message.error(`Error: ${error.message}`);
    return <p>Error loading data...</p>;
  }

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        name={car ? 'carEditForm' : 'carAddForm'}
        onFinish={onFinish}
        initialValues={{
          year: car?.year,
          make: car?.make,
          model: car?.model,
          price: car?.price,
          personId: personId,
        }}
        layout={car ? 'horizontal' : 'inline'}
        style={styles.form}>
        <Form.Item
          name="year"
          label="Year"
          style={styles.formItem}
          rules={[
            {required: true, message: 'Enter year'},
            {
              validator: (_, value) =>
                !value || !isNaN(value)
                  ? Promise.resolve()
                  : Promise.reject('Year must be a number'),
            },
          ]}>
          <Input placeholder="Year" style={styles.inputXSmall} />
        </Form.Item>
        <Form.Item
          name="make"
          label="Make"
          style={styles.formItem}
          rules={[{required: true, message: 'Enter make'}]}>
          <Input placeholder="Make" style={styles.inputNormal} />
        </Form.Item>
        <Form.Item
          name="model"
          label="Model"
          style={styles.formItem}
          rules={[{required: true, message: 'Enter model'}]}>
          <Input placeholder="Model" style={styles.inputNormal} />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          style={styles.formItem}
          rules={[
            {required: true, message: 'Enter price'},
            {
              validator: (_, value) =>
                !value || !isNaN(value)
                  ? Promise.resolve()
                  : Promise.reject('Price must be a number'),
            },
          ]}>
          <Input placeholder="Price" prefix="$" style={styles.inputSmall} />
        </Form.Item>
        <Form.Item
          name="personId"
          label="Person"
          style={styles.formItem}
          rules={[{required: true, message: 'Select a person'}]}>
          <Select placeholder="Select a person" style={styles.inputNormal}>
            {data?.people?.map((person: {id: string; firstName: string; lastName: string}) => (
              <Select.Option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item style={styles.formItem} shouldUpdate={true}>
          {() => (
            <>
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  car
                    ? // For update
                      (!form.isFieldTouched('year') &&
                        !form.isFieldTouched('make') &&
                        !form.isFieldTouched('model') &&
                        !form.isFieldTouched('price') &&
                        !form.isFieldTouched('personId')) ||
                      form.getFieldsError().filter(({errors}) => errors.length).length > 0
                    : // For add
                      !form.isFieldsTouched(true) ||
                      form.getFieldsError().filter(({errors}) => errors.length).length > 0
                }>
                {car ? 'Update Car' : 'Add Car'}
              </Button>
              {car && (
                <Button onClick={onEditComplete} style={styles.cancelButton}>
                  Cancel
                </Button>
              )}
            </>
          )}
        </Form.Item>
      </Form>
    </>
  );
};

export default CarForm;

const styles = {
  form: {
    justifyContent: 'center' as const,
  },
  formItem: {
    marginBottom: 10,
  },
  inputXSmall: {
    width: 60,
    textAlign: 'left' as const,
    marginBottom: 10,
  },
  inputSmall: {
    width: 90,
    textAlign: 'left' as const,
    marginBottom: 10,
  },
  inputNormal: {
    width: 150,
    textAlign: 'left' as const,
    marginBottom: 10,
  },
  cancelButton: {
    marginLeft: 10,
  },
  spinner: {
    display: 'block',
    margin: 'auto',
    marginTop: '50px',
  },
};
