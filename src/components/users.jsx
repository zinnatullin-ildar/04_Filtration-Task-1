import { useState, useEffect } from "react";
import Pagination from "./pagination";
import User from "./user";
import GroupList from "./groupList";
import SearchStatus from "./searchStatus";
import { paginate } from "../utils/paginate";
import api from "../api";
import { v4 as uuid } from "uuid";
import PropTypes from "prop-types";

const Users = ({ users: allUsers, ...rest }) => {
    // сниппет sfc
    const [currentPage, setCurrentPage] = useState(1);
    const [professions, setProfession] = useState([]);
    const [selectedProf, setSelectedProf] = useState();
    const pageSize = 4; // количество юзеров на странице

    useEffect(() => {
        api.professions.fetchAll().then((data) => setProfession(data));
    }, []);

    const handleProfessionSelect = (item) => {
        // console.log(item);
        setSelectedProf(item);
    };

    const handlePageChange = (pageIndex) => {
        // сниппет nfn
        setCurrentPage(pageIndex);
        // console.log("page: ", pageIndex);
    };

    const filteredUsers = selectedProf
        ? allUsers.filter(
              (user) =>
                  JSON.stringify(user.profession) ===
                  JSON.stringify(selectedProf) // данные приводим к строке и сравниваем строки
          )
        : allUsers;

    const count = filteredUsers.length; // количество юзеров

    const userCrop = paginate(filteredUsers, currentPage, pageSize);
    // console.log(userCrop);

    const clearFilter = () => {
        setSelectedProf(); // ничего не устанавливаем (undefined)
    };

    useEffect(() => {
        if (
            currentPage > Math.ceil(allUsers.length / pageSize) &&
            currentPage > 1
        ) {
            setCurrentPage(currentPage - 1);
        }
    }, [allUsers]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedProf]);

    return (
        <div className="d-flex">
            {professions && (
                <div className="d-flex flex-column flex-shrink p-3">
                    <GroupList
                        items={professions}
                        selectedItem={selectedProf}
                        onItemSelect={handleProfessionSelect}
                    />
                    <button
                        className="btn btn-secondary m-2"
                        onClick={clearFilter}
                    >
                        Очистить
                    </button>
                </div>
            )}

            <div className="d-flex flex-column">
                <SearchStatus length={count} />
                {count > 0 && (
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Имя</th>
                                <th scope="col">Качества</th>
                                <th scope="col">Профессия</th>
                                <th scope="col">Встретился, раз</th>
                                <th scope="col">Оценка</th>
                                <th scope="col">Избранное</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {userCrop.map((user) => (
                                <User {...rest} {...user} key={uuid()} />
                            ))}
                        </tbody>
                    </table>
                )}

                <div className="d-flex justify-content-center">
                    <Pagination
                        itemsCount={count}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};

Users.propTypes = {
    users: PropTypes.array
};

export default Users;
