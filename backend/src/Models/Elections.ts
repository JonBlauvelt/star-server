import { Uid } from '../../../domain_model/Uid';
import { Database } from './Database';
import { ILoggingContext } from '../Services/Logging/ILogger';
import Logger from '../Services/Logging/Logger';
import { Kysely, sql } from 'kysely'
import { NewElection, Election, UpdatedElection } from './IElection';
const tableName = 'electiondb';

export default class ElectionsDB {
    _postgresClient;
    _tableName: string = tableName;

    constructor(postgresClient: Kysely<Database>) {
        this._postgresClient = postgresClient;
        this.init()
    }

    async init(): Promise<ElectionsDB> {
        var appInitContext = Logger.createContext("appInit");
        Logger.debug(appInitContext, "-> ElectionsDB.init")
        return this;
    }

    async dropTable(ctx: ILoggingContext): Promise<void> {
        return this._postgresClient.schema.dropTable(tableName).execute()
    }

    createElection(election: Election, ctx: ILoggingContext, reason: string): Promise<Election> {
        Logger.debug(ctx, `${tableName}.createElection`, election);

        const stringifiedElection: NewElection = {
            ...election,
            settings: JSON.stringify(election.settings),
            races: JSON.stringify(election.races),
            admin_ids: JSON.stringify(election.admin_ids),
            audit_ids: JSON.stringify(election.audit_ids),
            credential_ids: JSON.stringify(election.credential_ids),
        }

        const newElection = this._postgresClient
            .insertInto(tableName)
            .values(stringifiedElection)
            .returningAll()
            .executeTakeFirstOrThrow()
        return newElection
    }

    updateElection(election: Election, ctx: ILoggingContext, reason: string): Promise<Election> {
        Logger.debug(ctx, `${tableName}.updateElection`, election);

        const stringifiedElection: UpdatedElection = {
            ...election,
            settings: JSON.stringify(election.settings),
            races: JSON.stringify(election.races),
            admin_ids: JSON.stringify(election.admin_ids),
            audit_ids: JSON.stringify(election.audit_ids),
            credential_ids: JSON.stringify(election.credential_ids),
        }

        const updatedElection = this._postgresClient
            .updateTable(tableName)
            .set(stringifiedElection)
            .where('election_id', '=', election.election_id)
            .returningAll()
            .executeTakeFirstOrThrow()

        return updatedElection
    }

    async getOpenElections(ctx: ILoggingContext): Promise<Election[] | null> {
        Logger.debug(ctx, `${tableName}.getOpenElections`);
        // Returns all elections where settings.voter_access == open and state == open

        // TODO: The filter is pretty inefficient for now since I don't think there's a way to include on settings.voter_access in the query
        const openElections = await this._postgresClient
            .selectFrom(tableName)
            .where('state', '=', 'open')
            .selectAll()
            .execute()

        // // Filter for settings.voter_access = open
        return openElections.filter((election: Election, index: any, array: any) => {
            return election.settings.voter_access == 'open';
        });
    }

    getElections(id: string, email: string, ctx: ILoggingContext): Promise<Election[] | null> {
        // When I filter in trello it adds "filter=member:arendpetercastelein,overdue:true" to the URL, I'm following the same pattern here
        Logger.debug(ctx, `${tableName}.getAll ${id} ${email}`);

        let querry = this._postgresClient
            .selectFrom(tableName)
            .selectAll()
        if (id !== '' || email !== '') {
            querry = querry.where(({ or, cmpr }) =>
                or([
                    cmpr('owner_id', '=', id),
                    cmpr(sql`admin_ids::jsonb`, '?', email),
                    cmpr(sql`audit_ids::jsonb`, '?', email),
                    cmpr(sql`credential_ids::jsonb`, '?', email)
                ]))
        }
        const elections = querry.execute()

        return elections
    }

    getElectionByID(election_id: Uid, ctx: ILoggingContext): Promise<Election | null> {
        Logger.debug(ctx, `${tableName}.getElectionByID ${election_id}`);

        const election = this._postgresClient
            .selectFrom(tableName)
            .where('election_id', '=', election_id)
            .selectAll()
            .executeTakeFirstOrThrow()

        return election
    }

    getElectionByIDs(election_ids: Uid[], ctx: ILoggingContext): Promise<Election[] | null> {
        Logger.debug(ctx, `${tableName}.getElectionByIDs ${election_ids.join(',')}`);

        const elections = this._postgresClient
            .selectFrom(tableName)
            .where('election_id', 'in', election_ids)
            .selectAll()
            .execute()

        return elections
    }

    delete(election_id: Uid, ctx: ILoggingContext, reason: string): Promise<boolean> {
        Logger.debug(ctx, `${tableName}.delete ${election_id}`);

        const deletedElection = this._postgresClient
            .deleteFrom(tableName)
            .where('election_id', '=', election_id)
            .returningAll()
            .executeTakeFirst()

        return deletedElection.then((election) => {
            if (election) {
                return true
            } else {
                return false
            }
        }
        )
    }
}