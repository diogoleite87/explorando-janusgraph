import { Api } from "../providers";
import { People, PeopleDTO } from "../schemas";

const getPeopleByID = (id: number) => Api.get<People>(`/people/${id}`)
const updatePeople = (id: number, people: PeopleDTO) => Api.put(`/people/${id}`, people)

export const GraphPeopleService = {
    getPeopleByID,
    updatePeople
}