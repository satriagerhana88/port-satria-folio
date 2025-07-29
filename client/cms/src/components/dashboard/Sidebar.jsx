import React from 'react'

const Sidebar = () => {
  return (
    <aside className="w-[80px] bg-[#0160c9] rounded-2xl p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav>
            <ul className="space-y-3">
                <li>
                    <a href="/dashboard/biodata">
                        <div className='flex items-center justify-center px-2 py-3 bg-[rgba(255,255,255,0.8)] rounded-2xl'>
                        </div>
                    </a>
                </li>
                <li><a href="/dashboard/education" className="hover:text-yellow-400">Education</a></li>
                <li><a href="/dashboard/experience" className="hover:text-yellow-400">Experience</a></li>
                <li><a href="/dashboard/course" className="hover:text-yellow-400">Course</a></li>
                <li><a href="/dashboard/skills" className="hover:text-yellow-400">Skills</a></li>
                <li><a href="/dashboard/tools" className="hover:text-yellow-400">Tools</a></li>
            </ul>
        </nav>
    </aside>
  )
}

export default Sidebar