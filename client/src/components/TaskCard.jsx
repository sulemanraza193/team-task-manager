const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    'completed': 'bg-green-100 text-green-700',
};

const TaskCard = ({ task, onEdit, onDelete }) => {
    return (
        <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition bg-white">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{task.title}</h3>
                    {task.description && (
                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[task.status]}`}>
                            {task.status}
                        </span>
                        {task.due_date && (
                            <span className="text-xs text-gray-400">
                                📅 {new Date(task.due_date).toLocaleDateString()}
                            </span>
                        )}
                        {task.assigned_to && (
                            <span className="text-xs text-gray-400">
                                👤 Assignee #{task.assigned_to}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 ml-4">
                    <button
                        onClick={() => onEdit(task)}
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="text-red-400 hover:text-red-600 text-sm font-medium"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;