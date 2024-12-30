import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';
import { format } from 'date-fns';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { BiSortAlt2 } from 'react-icons/bi';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { MdEdit } from 'react-icons/md';

const TaskList = () => {
  const [tasks, setTasks] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [refresh, setRefresh] = useState();
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [sort, setSort] = useState('startTimeAsc');
  const [priority, setPriority] = useState();
  const [status, setStatus] = useState();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [addTask, setAddTask] = useState(null);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.API_PREFIX}/tasks/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { sort, priority, status },
        });
        setTasks(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTasks();
  }, [refresh, sort, priority, status]);

  const handleCheckboxChange = (taskId) => {
    setSelectedIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedIds(tasks.map((task) => task._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${config.API_PREFIX}/tasks/delete-selected`,
        { ids: selectedIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setTasks((prev) =>
        prev.filter((task) => !selectedIds.includes(task._id)),
      );
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
    } finally {
      setRefresh((prevState) => !prevState);
    }
  };

  return (
    <div className="flex">
      <div className="flex-col space-y-8 w-[95%] mx-auto p-6">
        <header className="text-2xl font-bold">Task list</header>
        <div className="flex justify-between">
          <div className="flex justify-between gap-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="border border-gray-500 p-2 rounded flex justify-between gap-2 items-center text-[#7c3aed] font-medium"
            >
              <AiOutlinePlus />
              Add task
            </button>
            <button
              onClick={handleDeleteSelected}
              className="border border-gray-500 p-2 rounded flex justify-between gap-2 items-center text-red-700 font-medium"
              disabled={selectedIds.length === 0}
            >
              <MdDelete />
              Delete selected
            </button>
          </div>
          <div className="flex justify-between my-auto gap-4">
            <div className="relative">
              <button
                onClick={() => {
                  setIsSortDropdownOpen((prev) => !prev);
                  setIsPriorityDropdownOpen(false);
                  setIsStatusDropdownOpen(false);
                }}
                className="px-3 py-0.5 rounded-full flex justify-between gap-2 items-center text-white font-medium bg-[#798896]"
              >
                <BiSortAlt2 />
                Sort
              </button>
              {isSortDropdownOpen && (
                <div className={styles.dropDowns}>
                  <div
                    onClick={() => setSort('startTimeAsc')}
                    className={styles.dropDownOptions}
                  >
                    Start time: ASC
                  </div>
                  <div
                    onClick={() => setSort('startTimeDesc')}
                    className={styles.dropDownOptions}
                  >
                    Start time: DESC
                  </div>
                  <div
                    onClick={() => setSort('endTimeAsc')}
                    className={styles.dropDownOptions}
                  >
                    End time: ASC
                  </div>
                  <div
                    onClick={() => setSort('endTimeDesc')}
                    className={styles.dropDownOptions}
                  >
                    End time: DESC
                  </div>
                  <div
                    onClick={() => {
                      setSort('');
                      setIsSortDropdownOpen(false);
                    }}
                    className="px-4 py-2 text-red-500 text-center cursor-pointer border border-gray-300 hover:bg-gray-100"
                  >
                    Remove sort
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setIsPriorityDropdownOpen((prev) => !prev);
                  setIsSortDropdownOpen(false);
                  setIsStatusDropdownOpen(false);
                }}
                className={styles.dropDownButtons}
              >
                <RiArrowDropDownLine size={24} />
                Priority
              </button>
              {isPriorityDropdownOpen && (
                <div className={styles.dropDowns}>
                  {[1, 2, 3, 4, 5].map((priorityValue) => (
                    <div
                      key={priorityValue}
                      onClick={() => {
                        setPriority(priorityValue);
                        setSort('');
                        setStatus();
                      }}
                      className={styles.dropDownOptions}
                    >
                      {priorityValue}
                    </div>
                  ))}
                  <div
                    onClick={() => {
                      setPriority();
                      setIsPriorityDropdownOpen(false);
                    }}
                    className="px-4 py-2 text-red-500 text-center cursor-pointer border border-gray-300 hover:bg-gray-100"
                  >
                    Remove filter
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => {
                  setIsStatusDropdownOpen((prev) => !prev);
                  setIsSortDropdownOpen(false);
                  setIsPriorityDropdownOpen(false);
                }}
                className={styles.dropDownButtons}
              >
                <RiArrowDropDownLine size={24} />
                Status
              </button>
              {isStatusDropdownOpen && (
                <div className={styles.dropDowns}>
                  <div
                    onClick={() => {
                      setStatus(false);
                      setPriority();
                      setSort('');
                    }}
                    className={styles.dropDownOptions}
                  >
                    Pending
                  </div>
                  <div
                    onClick={() => {
                      setStatus(true);
                      setPriority();
                      setSort('');
                    }}
                    className={styles.dropDownOptions}
                  >
                    Finished
                  </div>
                  <div
                    onClick={() => {
                      setStatus();
                      setIsSortDropdownOpen(false);
                    }}
                    className="px-4 py-2 text-red-500 text-center cursor-pointer border border-gray-300 hover:bg-gray-100"
                  >
                    Remove filter
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-[#798896]">
              <th className={styles.tableHeadCell}>
                <input
                  name="checkAll"
                  type="checkbox"
                  onChange={handleSelectAllChange}
                  checked={
                    tasks && selectedIds.length === tasks.length
                  }
                />
              </th>
              <th className={styles.tableHeadCell}>Task ID</th>
              <th className={styles.tableHeadCell}>Title</th>
              <th className={styles.tableHeadCell}>Priority</th>
              <th className={styles.tableHeadCell}>Status</th>
              <th className={styles.tableHeadCell}>Start Time</th>
              <th className={styles.tableHeadCell}>End Time</th>
              <th className={styles.tableHeadCell}>
                Total time to finish (hrs)
              </th>
              <th className={styles.tableHeadCell}>Edit</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task, index) => {
              return (
                <tr key={index}>
                  <td className={styles.tableDataCell}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(task._id)}
                      onChange={() => handleCheckboxChange(task._id)}
                    />
                  </td>
                  <td className={styles.tableDataCell}>{task._id}</td>
                  <td className={styles.tableDataCell}>{task.title}</td>
                  <td className={styles.tableDataCell}>{task.priority}</td>
                  <td className={styles.tableDataCell}>
                    {task.taskStatus ? 'Finished' : 'Pending'}
                  </td>
                  <td className={styles.tableDataCell}>
                    {format(new Date(task.startTime), 'dd-MMM-yy hh:mm a')}
                  </td>
                  <td className={styles.tableDataCell}>
                    {format(new Date(task.endTime), 'dd-MMM-yy hh:mm a')}
                  </td>
                  <td className={styles.tableDataCell}>
                    {task.timeToFinish}
                  </td>
                  <td className={styles.tableDataCell}>
                    <MdEdit
                      onClick={() => {
                        setEditTask(task);
                        setIsEditModalOpen(true);
                      }}
                      className="cursor-pointer"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* modals */}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Add new task</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const token = localStorage.getItem('token');
                  await axios.post(
                    `${config.API_PREFIX}/tasks/me`,
                    {
                      title: addTask.title,
                      priority: addTask.priority,
                      status: addTask.status,
                      startTime: addTask.startTime,
                      endTime: addTask.endTime,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    },
                  );
                } catch (err) {
                  console.error(err);
                } finally {
                  setRefresh((prev) => !prev); // Refresh task list
                  setIsAddModalOpen(false); // Close modal
                }
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={addTask?.title || ''}
                  onChange={(e) =>
                    setAddTask({ ...addTask, title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <select
                  value={addTask?.priority || ''}
                  onChange={(e) =>
                    setAddTask({ ...addTask, priority: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="" disabled>
                    Select priority
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Status
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      checked={addTask?.status === false}
                      onChange={() =>
                        setAddTask({ ...addTask, status: false })
                      }
                    />
                    <span className="ml-2">Pending</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      checked={addTask?.status === true}
                      onChange={() =>
                        setAddTask({ ...addTask, status: true })
                      }
                    />
                    <span className="ml-2">Finished</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={addTask?.startTime || ''}
                  onChange={(e) =>
                    setAddTask({ ...addTask, startTime: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={addTask?.endTime || ''}
                  onChange={(e) =>
                    setAddTask({ ...addTask, endTime: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editTask && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Edit task</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const token = localStorage.getItem('token');
                  await axios.patch(
                    `${config.API_PREFIX}/tasks/me/${editTask._id}`,
                    {
                      title: editTask.title,
                      priority: editTask.priority,
                      status: editTask.status,
                      startTime: editTask.startTime,
                      endTime: editTask.endTime,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    },
                  );
                } catch (err) {
                  console.error(err);
                } finally {
                  setRefresh((prev) => !prev);
                  setIsEditModalOpen(false);
                }
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editTask.title}
                  onChange={(e) =>
                    setEditTask({ ...editTask, title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <select
                  value={editTask.priority}
                  onChange={(e) =>
                    setEditTask({ ...editTask, priority: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Status
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      checked={!editTask.status}
                      onChange={() =>
                        setEditTask({ ...editTask, status: false })
                      }
                    />
                    <span className="ml-2">Pending</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      checked={editTask.status}
                      onChange={() =>
                        setEditTask({ ...editTask, status: true })
                      }
                    />
                    <span className="ml-2">Finished</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={editTask.startTime}
                  onChange={(e) =>
                    setEditTask({ ...editTask, startTime: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={editTask.endTime}
                  onChange={(e) =>
                    setEditTask({ ...editTask, endTime: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;

const styles = {
  dropDownButtons:
    'px-2 py-1 rounded-full flex justify-between gap-2 items-center text-[#798896] font-medium border border-gray-500',
  dropDowns:
    'absolute top-full mt-2 bg-white border border-gray-300 rounded shadow-md z-50 w-[10vw]',
  dropDownOptions:
    'px-4 py-2 text-center cursor-pointer hover:bg-gray-100',
  tableHeadCell:
    'px-4 py-2 text-center text-sm font-bold text-white border border-gray-300',
  tableDataCell:
    'px-4 py-2 text-sm font-semibold border border-gray-300 text-center',
};
