import { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { Project } from '../types';
import { ExternalLink, ArrowLeft } from 'lucide-react';

export function AppViewer() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;
        const p = db.getProject(projectId);
        if (p) {
            setProject(p);
        }
        setLoading(false);
    }, [projectId]);

    if (!projectId) return <Navigate to="/dashboard" replace />;

    if (loading) {
        return (
            <div className="flex items-center justify-center w-screen h-screen bg-[#0f0a18] text-white">
                <div className="animate-pulse text-violet-300">Cargando aplicación...</div>
            </div>
        );
    }

    if (!project || !project.publishedUrl) {
        return (
            <div className="flex items-center justify-center w-screen h-screen bg-[#0f0a18] text-white">
                <div className="bg-[#1c0f2e] border border-violet-500/30 p-8 rounded-2xl max-w-md text-center">
                    <h2 className="text-xl font-bold mb-2 text-violet-100">Aplicación no disponible</h2>
                    <p className="text-violet-300/70 text-sm">Esta aplicación no existe o aún no ha sido publicada.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen flex flex-col bg-[#0f0a18]">
            <div className="h-14 shrink-0 border-b border-white/10 bg-[#1c0f2e] flex items-center justify-between px-4">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-violet-300 hover:text-white transition-colors text-sm"
                >
                    <ArrowLeft size={16} /> Volver al Panel
                </button>
                
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-md bg-black/30 border border-white/5 text-xs text-white/70 font-mono">
                        {project.publishedUrl}
                    </div>
                    <a 
                        href={project.publishedUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                        Abrir en pestaña nueva <ExternalLink size={14} />
                    </a>
                </div>
            </div>
            
            <div className="flex-1 w-full relative bg-white">
                <iframe
                    src={project.publishedUrl}
                    className="w-full h-full border-0 absolute inset-0"
                    title={`App: ${project.name}`}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-top-navigation"
                />
            </div>
        </div>
    );
}
