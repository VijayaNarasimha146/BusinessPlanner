import React from 'react';
import PlannerHeader from './components/PlannerHeader';
import MonthExpander from './components/MonthExpander';
import WeekExpander from './components/WeekExpander';
import DayPagination from './components/DayPagination';
import DayPage from './components/DayPage';

const App = () => {
    return (
        <div>
            <PlannerHeader />
            <MonthExpander />
            <WeekExpander />
            <DayPagination />
            <DayPage />
        </div>
    );
};

export default App;