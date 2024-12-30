import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';

const Dashboard = () => {
  const location = useLocation();
  const [summary, setSummary] = useState();

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      const fetchSummary = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `${config.API_PREFIX}/tasks/dashboard`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          setSummary(response.data.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchSummary();
    }
  }, [location.pathname]);

  return (
    <div className="px-14">
      <header className="font-bold text-3xl py-6">Dashboard</header>
      <div className="flex">
        <div className="flex flex-col justify-between gap-12">
          <div id="summary-cont" className={styles.summaryCont}>
            <header className="font-semibold text-2xl">Summary</header>
            <div className="flex">
              <div
                id="summary-data-cont"
                className={styles.summaryDataCont}
              >
                <div
                  id="individual-summary-cont"
                  className={styles.individualSummaryCont}
                >
                  <header id="data" className={styles.data}>
                    {summary?.summary.totalTasks}
                  </header>
                  <p id="data-title">Total tasks</p>
                </div>
                <div
                  id="individual-summary-cont"
                  className={styles.individualSummaryCont}
                >
                  <header id="data" className={styles.data}>
                    {summary?.summary.tasksCompleted *
                      (100 / summary?.summary.totalTasks)}
                    %
                  </header>
                  <p id="data-title">Tasks completed</p>
                </div>
                <div
                  id="individual-summary-cont"
                  className={styles.individualSummaryCont}
                >
                  <header id="data" className={styles.data}>
                    {summary?.summary.tasksPending *
                      (100 / summary?.summary.totalTasks)}
                    %
                  </header>
                  <p id="data-title">Tasks pending</p>
                </div>
                <div
                  id="individual-summary-cont"
                  className={styles.individualSummaryCont}
                >
                  <header id="data" className={styles.data}>
                    {summary?.summary.averageCompletionTime}hrs
                  </header>
                  <p id="data-title">Average time per completed task</p>
                </div>
              </div>
            </div>
          </div>

          <div id="summary-cont" className={styles.summaryCont}>
            <header className="font-semibold text-2xl">
              Pending task summary
            </header>
            <div className="flex">
              <div
                id="summary-data-cont"
                className={styles.summaryDataCont}
              >
                <div
                  id="individual-summary-cont"
                  className={styles.individualSummaryCont}
                >
                  <header id="data" className={styles.data}>
                    {summary?.totalPendingTasks}
                  </header>
                  <p id="data-title">Pending tasks</p>
                </div>
                <div
                  id="individual-summary-cont"
                  className={styles.individualSummaryCont}
                >
                  <header id="data" className={styles.data}>
                    {summary?.summary.totalTimeLapsed}hrs
                  </header>
                  <p id="data-title">Total time lapsed</p>
                </div>
                <div
                  id="individual-summary-cont"
                  className={styles.individualSummaryCont}
                >
                  <header id="data" className={styles.data}>
                    {summary?.totalTimeToFinish}hrs
                  </header>
                  <p id="data-title">
                    Total time to finsh <i>estimated based on end time</i>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-[#798896]">
                <th className={styles.tableHeadCell}>Task priority</th>
                <th className={styles.tableHeadCell}>Pending tasks</th>
                <th className={styles.tableHeadCell}>Time lapsed (hrs)</th>
                <th className={styles.tableHeadCell}>
                  Time to finish (hrs)
                </th>
              </tr>
            </thead>
            <tbody>
              {summary?.tableSummary.map((row, index) => {
                return (
                  <tr key={index}>
                    <td className={styles.tableDataCell}>
                      {row.priority}
                    </td>
                    <td className={styles.tableDataCell}>
                      {row.pendingTasks}
                    </td>
                    <td className={styles.tableDataCell}>
                      {row.timeLapsed}
                    </td>
                    <td className={styles.tableDataCell}>
                      {row.timeToFinish}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

const styles = {
  summaryCont: '',
  summaryDataCont: 'mt-4 flex justify-between gap-12',
  individualSummaryCont: 'flex flex-col justify-between gap-2 text-center',
  data: 'font-bold text-3xl text-[#7161ed]',
  tableHeadCell:
    'px-2 py-1 text-center text-sm font-bold text-white border border-gray-300',
  tableDataCell:
    'px-2 py-1 text-sm font-semibold border border-gray-300 text-center',
};
