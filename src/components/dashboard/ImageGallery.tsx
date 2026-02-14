import { useState } from 'react';
import { X, Download, ZoomIn, Image as ImageIcon } from 'lucide-react';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

interface ImageGalleryProps {
    images?: {
        industrial_area?: string;
        satellite_past?: string;
        satellite_present?: string;
        osm?: string;
        encroachment_analysis?: string;
        past_overlay?: string;
        present_overlay?: string;
    };
    zone?: string;
}

interface ImageItem {
    key: string;
    filename: string;
    label: string;
    description: string;
}

export function ImageGallery({ images, zone }: ImageGalleryProps) {
    const [lightboxImage, setLightboxImage] = useState<ImageItem | null>(null);

    if (!images || Object.values(images).filter(Boolean).length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Images Available</h3>
                    <p className="text-sm text-gray-600">
                        Run an analysis to generate satellite imagery and encroachment detection maps
                    </p>
                </div>
            </div>
        );
    }

    const imageItems: ImageItem[] = [
        {
            key: 'industrial_area',
            filename: images.industrial_area || '',
            label: 'Industrial Area Map',
            description: 'Official CSIDC approved layout map'
        },
        {
            key: 'satellite_past',
            filename: images.satellite_past || '',
            label: 'Past Satellite Image',
            description: 'Satellite imagery from 2 years ago'
        },
        {
            key: 'satellite_present',
            filename: images.satellite_present || '',
            label: 'Present Satellite Image',
            description: 'Current satellite imagery'
        },
        {
            key: 'encroachment_analysis',
            filename: images.encroachment_analysis || '',
            label: 'Encroachment Analysis',
            description: 'AI-detected boundary compliance (Green=Match, Yellow=Past, Blue=Present)'
        },
        {
            key: 'past_overlay',
            filename: images.past_overlay || '',
            label: 'Past Overlay',
            description: 'Approved boundaries overlaid on past satellite'
        },
        {
            key: 'present_overlay',
            filename: images.present_overlay || '',
            label: 'Present Overlay',
            description: 'Approved boundaries overlaid on current satellite'
        },
        {
            key: 'osm',
            filename: images.osm || '',
            label: 'OpenStreetMap View',
            description: 'OSM road and infrastructure overlay'
        }
    ].filter(item => item.filename);

    const getImageUrl = (filename: string) => `${API_URL}/api/images/${filename}`;

    const downloadImage = (filename: string, label: string) => {
        const link = document.createElement('a');
        link.href = getImageUrl(filename);
        link.download = `${zone}_${label.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Analysis Images</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {imageItems.length} images generated for {zone || 'selected zone'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {imageItems.map((item) => (
                        <div
                            key={item.key}
                            className="group relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-teal-600 transition-all"
                        >
                            {/* Image */}
                            <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                <img
                                    src={getImageUrl(item.filename)}
                                    alt={item.label}
                                    className="w-full h-full object-cover"
                                />

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => setLightboxImage(item)}
                                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                        title="View full size"
                                    >
                                        <ZoomIn className="w-5 h-5 text-gray-900" />
                                    </button>
                                    <button
                                        onClick={() => downloadImage(item.filename, item.label)}
                                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                        title="Download image"
                                    >
                                        <Download className="w-5 h-5 text-gray-900" />
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <h4 className="font-medium text-gray-900 text-sm mb-1">{item.label}</h4>
                                <p className="text-xs text-gray-600">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightboxImage(null)}
                >
                    <button
                        onClick={() => setLightboxImage(null)}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="max-w-7xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-white rounded-lg overflow-hidden">
                            <img
                                src={getImageUrl(lightboxImage.filename)}
                                alt={lightboxImage.label}
                                className="w-full h-auto"
                            />
                            <div className="p-6 border-t border-gray-200">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{lightboxImage.label}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{lightboxImage.description}</p>
                                    </div>
                                    <button
                                        onClick={() => downloadImage(lightboxImage.filename, lightboxImage.label)}
                                        className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
