import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodProp {
	id: number,
	name: string,
	description: string,
	price: number,
	available: boolean,
	image: string,
	teste: string
}

interface EditFoodInput {
	image: string,
	name: string, 
	price: string,
	description: string
}


interface DashboardProps{

}

export default function Dashboard({}: DashboardProps){

	const [foods, setFoods] = useState<FoodProp[]>([]);
	const [editingFood, setEditingFood] = useState<FoodProp>({} as FoodProp);
	const [modalOpen, setModalOpen]	= useState(false);
	const [editModalOpen, setEditigModalOpen] = useState(false);


	useEffect(() => {
			async function getFood(){
				const response = await api.get('/foods');
				setFoods(response.data);
			}
		getFood();
	},[]);

  const handleAddFood = async (food: EditFoodInput): Promise<void> => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

			setFoods([...foods, response.data]);

    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: EditFoodInput): Promise<void> => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

			setFoods(foodsUpdated);

    } catch (err) {
      console.log(err);
    }
  }

	const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const toggleEditModal = () => {
		setEditigModalOpen(!editModalOpen);
  }

  const handleEditFood = (food: FoodProp) => {
		setEditigModalOpen(true);
    setEditingFood(food)
  }
	return (
		<>
			<Header openModal={toggleModal} />
			<ModalAddFood
				isOpen={modalOpen}
				setIsOpen={toggleModal}
				handleAddFood={handleAddFood}
			/>
			<ModalEditFood
				isOpen={editModalOpen}
				setIsOpen={toggleEditModal}
				editingFood={editingFood}
				handleUpdateFood={handleUpdateFood}
			/>

			<FoodsContainer data-testid="foods-list">
				{foods &&
					foods.map(food => (
						<Food
							key={food.id}
							food={food}
							handleDelete={handleDeleteFood}
							handleEditFood={handleEditFood}
						/>
					))}
			</FoodsContainer>
		</>
	);
}
