/**
 * Embed requirements.
 */
import { store as commandsStore } from '@wordpress/commands';
import { dispatch } from '@wordpress/data';
import { useSelect } from '@wordpress/data';
import { useMemo } from "@wordpress/element";
import { store as coreStore } from "@wordpress/core-data";
import { addQueryArgs } from '@wordpress/url';
import { post } from '@wordpress/icons';

/**
 * Initiate the custom command to search for services.
 */
dispatch( commandsStore ).registerCommandLoader( {
    name: 'command-palette-demo/posts',
    hook: useDemoPostsInCommandPalette,
} );

function useDemoPostsInCommandPalette( { search } ) {
    // Retrieve the pages for the "search" term.
    const { records, isLoading } = useSelect(
        (select) => {
            const { getEntityRecords } = select(coreStore);
            const query = {
                search: !!search ? search : undefined,
                per_page: 10,
                orderby: search ? "relevance" : "date",
            };
            return {
                records: getEntityRecords("postType", "cpd_demo", query),
                isLoading: !select(coreStore).hasFinishedResolution(
                    "getEntityRecords",
                    "postType",
                    "page",
                    query
                ),
            };
        },
        [search]
    );

    /**
     * Create the commands.
     */
    const commands = useMemo(() => {
        return (records ?? []).slice(0, 10).map((record) => {
            return {
                name: record.title?.rendered + " " + record.id,
                label: record.title?.rendered
                    ? record.title?.rendered
                    : __("(no title)"),
                icon: post,
                category: 'view',
                callback: ({ close }) => {
                    const args = {
                        action: 'edit',
                        post: record.id
                    };
                    document.location = addQueryArgs("post.php", args);
                    close();
                },
            };
        });
    }, [records, history]);

    return {
        commands,
        isLoading
    };
}

/**
 * Initiate the custom command.
 */
dispatch( commandsStore ).registerCommandLoader( {
    name: 'command-palette-demo/new',
    hook: addCommandInCommandPalette,
} );

/**
 * Define our custom action.
 *
 * @returns {{commands: *}}
 */
function addCommandInCommandPalette() {
    const commands = useMemo( () => {
        return [
            {
                name: 'command-palette-demo/new',
                label: 'New Demo Post',
                icon: 'post',
                callback: ( { close } ) => {
                    close();
                    const args = {
                        post_type: 'cpd_demo',
                    };
                    document.location = addQueryArgs("post-new.php", args);
                },
            },
        ];
    }, [] );

    return { commands };
}