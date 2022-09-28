const Project = require('../models/project')
const Client = require('../models/client')
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLEnumType } = require('graphql')

const ClientType = new GraphQLObjectType({
    name: 'client',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        phone: {
            type: GraphQLString
        }
    })
})

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        status: {
            type: GraphQLString
        },
        client: {
            type: ClientType,
            resolve: (parent, args) => {
                return Client.findById(parent.clientId)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        clients: {
            type: new GraphQLList(ClientType),
            resolve: () => {
                return Client.find()
            }
        },
        client: {
            type: ClientType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve: (parent, args) => {
                return Client.findById(args.id)
            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve: () => {
                return Project.find()
            }
        },
        project: {
            type: ProjectType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve: (parent, args) => {
                return Project.findById(args.id)
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addClient: {
            type: ClientType,
            args: {
                name: {
                    type: GraphQLString
                },
                email: {
                    type: GraphQLString
                },
                phone: {
                    type: GraphQLString
                }
            },
            resolve: async (parent, args) => {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                })
                await client.save()
                return client
            }
        },
        deleteClient: {
            type: ClientType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve: (parent, args) => {
                const id = args.id
                return Client.findByIdAndRemove(id)
            }
        },
        addProject: {
            type: ProjectType,
            args: {
                name: {
                    type: GraphQLString
                },
                description: {
                    type: GraphQLString
                },
                status: {
                    type: new GraphQLEnumType({
                        name: 'Status',
                        values: {
                            new: {
                                value: 'Not Started'
                            },
                            progress: {
                                value: 'In Progress'
                            },
                            complete: {
                                value: 'Completed'
                            }
                        }
                    }),
                    defaultValue: 'Not Started'
                },
                clientId: {
                    type: GraphQLID
                }
            },
            resolve: async (parent, args) => {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                })
                await project.save()
                return project
            }
        },
        updateProject: {
            type: ProjectType,
            args: {
                id: {
                    type: GraphQLID
                },
                status: {
                    type: new GraphQLEnumType({
                        name: 'updatestatus',
                        values: {
                            new: {
                                value: 'Not Started'
                            },
                            progress: {
                                value: 'In Progress'
                            },
                            complete: {
                                value: 'Completed'
                            }
                        }
                    })
                }
            },
            resolve: async (parent, args) => {
                const id = args.id
                const project = await Project.findById(id)
                if (!project) {
                    throw new Error('Project Does Not Exists')
                }
                project.status = args.status
                await project.save()
                return project
            }
        },
        deleteProject: {
            type: ProjectType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve: (parent, args) => {
                const id = args.id
                return Project.findByIdAndRemove(id)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})