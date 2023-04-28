import { ForceGraph3D, ForceGraph2D } from 'react-force-graph';
import { GraphData } from '../../schemas';
import { useEffect, useState } from 'react';
import { GraphCountryService } from '../../services/GraphCountryService';
import { GraphInteractiveService } from '../../services/GraphInteractiveService';

interface IGraphInteractiveProps {
    width: number
    height: number
    type: 'Graph 2D' | 'Graph 3D'
}

export function GraphInteractive({ width, height, type }: IGraphInteractiveProps) {

    const [data, setData] = useState<GraphData>()

    console.log(type)

    useEffect(() => {
        GraphCountryService.getGraphData().then(res => {
            setData(res.data)
        })

    }, [])

    const expandGraph = async (id: number) => {

        GraphInteractiveService.getExpandInteractiveGraph(id).then(res => {
            setData(prevState => {
                const nodeSet = new Set(prevState!.nodes.map(node => node.id));
                const newNodes = res.data.nodes.filter(node => !nodeSet.has(node.id));
                const newGraphData = {
                    ...prevState,
                    nodes: [...prevState!.nodes, ...newNodes],
                    links: [...prevState!.links, ...res.data.links]
                };
                return newGraphData;
            });
        });

    }

    return (
        type == 'Graph 2D' ?
            <ForceGraph2D width={width} height={height} graphData={data} onNodeClick={(node) => expandGraph(Number(node.id))} nodeAutoColorBy={'label'} />
            :
            <ForceGraph3D width={width} height={height} graphData={data} onNodeClick={(node) => expandGraph(Number(node.id))} nodeAutoColorBy={'label'} />

    )
}